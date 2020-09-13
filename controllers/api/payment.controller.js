const { of } = require('await-of');
const BaseController = require('./base.controller');
const Payment = require('../../models/payment.model');
const Client = require('../../models/client.model');
const Billing = require('../../models/billing.model');
const Appointment = require('../../models/appoiment.model');
const paytabs = require('paytabs_api');
const Responder = require('../../lib/expressResponder');

const key = 'EpuZXjBNoi8zUq23E26mYV5hdyLpSFXx5rx2L8Q9rZJlqLp4NwrLrw2E5O3Xt0uys2BdarnCq6YQRnVETmqkStYXh2VL2qkvsVID';
const paytabEmail = 'ajaypatidar198@gmail.com';
const baseUrl = "http://34.71.64.72:3005"

require('../../lib/authorizeUser');

class PaymentController extends BaseController {
    constructor() {
        super()
        console.log('payment init');
    }
    createLink = async (req, res) => {
        const billing = await Billing.findOne({ appointmentId: req.params.appointmentId });
        const client = await Client.findById(billing.clientId);

        paytabs.createPayPage({
            'merchant_email': paytabEmail,
            'secret_key': key,
            'currency': 'USD',
            'amount': billing.amount,
            'site_url': 'webonex.in',
            'title': 'The Light House Appointment Payment',
            'quantity': 1,
            'unit_price': billing.amount,
            'products_per_title': 'Dr. Amppointment Fee',
            'return_url': baseUrl + '/api/payment/response',
            'cc_first_name': 'Mr.',
            'cc_last_name': client.firstName,
            'cc_phone_number': '00973',
            'phone_number': '5465465',
            'billing_address': 'new york',
            'city': 'city',
            'state': 'Dubai',
            'postal_code': '1234',
            'country': 'BHR',
            'email': client.email,
            'ip_customer': req.body.publicIp,
            'ip_merchant': '35.239.10.74',
            'address_shipping': 'Shipping',
            'city_shipping': 'Dubai',
            'state_shipping': 'Dubai',
            'postal_code_shipping': '973',
            'country_shipping': 'BHR',
            'other_charges': 0,
            'reference_no': 1234,
            'msg_lang': 'en',
            'cms_with_version': 'Nodejs Lib v1',
        }, createPayPage);

        async function createPayPage(result) {
            if (result.response_code == 4012) {
                console.log(result.payment_url);
                console.log('meta data', result);

                const data = {
                    billingId: billing._id,
                    amount: billing.amount,
                    status: 'init',
                    txnId: null,
                    metaData: result,
                    p_id: result.p_id,
                    mode: 'card'
                }
                const payment = new Payment(data);
                const [paymentsave, err] = await of(payment.save());
                if (err) {
                    Responder.operationFailed(res, err);
                }
                Responder.success(res, { url: result.payment_url, billingId: paymentsave.billingId });
            } else {
                console.log(result);
                Responder.operationFailed(res, result);
            }
        }
    }

    response = async (req, res) => {
        const { payment_reference } = req.body
        if (payment_reference) {
            paytabs.verifyPayment({
                'merchant_email': paytabEmail,
                'secret_key': key,
                'payment_reference': payment_reference
            }, verifyPayment);

            async function verifyPayment(response) {
                if (response.response_code == 100) {
                    const [result, err] = await of(Payment.findOneAndUpdate({ p_id: payment_reference }, { status: 'success', metaData: response }).sort({ createdAt: -1 }));
                    if (err) {
                        Responder.operationFailed(res, err);
                    }
                    const billinUpdate = await Billing.findByIdAndUpdate(result.billingId, { status: 'paid' });
                    const appointment = await Appointment.findByIdAndUpdate(billinUpdate.appointmentId, { status: 'booked' });
                }
            }

        } else {
            console.log('some issue payment faild');
        }
    }

    statusCheck = async (req, res) => {
        const [result, err] = await of(Payment.findOne({ billingId: req.params.billingId }).select('amount status').sort({ createdAt: -1 }));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result);
    }

    paypal = async (req, res) => {
        try {
            var paypal = require('paypal-rest-sdk');
            paypal.configure({
                'mode': 'sandbox', //sandbox or live
                'client_id': 'Aa6mcy5nzizN4mf4oTrt7ynb5oC06iUuFqrbEP-Ly-wXe51bAjrM_LSwCTyqlarXz40MwB3PkrtYbKDP',
                'client_secret': 'EJIOn3cLyq1QOG-CjTyGttUGOWaJ1kEpA2_ygxHKjG-a27os8ewd-sfH-xehjd2TCYaLrKWe0v_hkv0f'
            });
            const billing = await Billing.findOne({ appointmentId: req.params.appointmentId });
            const client = await Client.findById(billing.clientId);
            var payment = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": baseUrl + "/api/payment/paypal_success",
                    "cancel_url": baseUrl + "/api/payment/paypal_fail"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "item",
                            "sku": "item",
                            "price": "1.00",
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": "1.00"
                    },
                    "description": "This is the payment description."
                }]
            };
            paypal.payment.create(payment, async function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    console.log("Create Payment Response");
                    const data = {
                        billingId: billing._id,
                        status: 'init',
                        p_id: payment.id,
                        metaData : payment,
                        mode : 'paypal'
                    }
                    const [ result, err ] = await of(new Payment(data).save());
                    if (err) {
                        Responder.operationFailed(res, err)
                    }
                    Responder.success(res, result)
                }
            });
        } catch (error) {
            console.log(error);
            
        }
    }

    paypalSuccess = async (req, res) => {
        try {
            console.log('payment success',req.query);
            const response = req.query
            const [result, err] = await of(Payment.findOneAndUpdate({ p_id: response.paymentId }, { status: 'success', metaData: response }).sort({ createdAt: -1 }));
            if (err) {
                Responder.operationFailed(res, err);
            }
            const billinUpdate = await Billing.findByIdAndUpdate(result.billingId, { status: 'paid' });
            const appointment = await Appointment.findByIdAndUpdate(billinUpdate.appointmentId, { status: 'booked' });
        } catch (err) {
            console.log(err);
            Responder.operationFailed(res, err)
        }
    }

    paypalFaild = async (req, res) => {
        try {
            console.log('payment faild====>',req.query);
            const [result, err] = await of(Payment.findOneAndUpdate({ p_id: response.paymentId }, { status: 'failed', metaData: response }));
            if (err) {
                Responder.operationFailed(res, err);
            }
            
        } catch (err) {
            console.log(err);
            Responder.operationFailed(res, err)
        }
    }

    echeck = async (req, res) => {
        try {
            const billing = await Billing.findOne({ appointmentId: req.params.appointmentId });
            const client = await Client.findById(billing.clientId);
            const data = {
                billingId: billing._id,
                status: 'unpaid',
                mode : 'e-check'
            }
            const [result, err] = await of(new Payment(data).save());
            if (err) {
                Responder.operationFailed(res, err);
            }
            const billinUpdate = await Billing.findByIdAndUpdate(result.billingId, { status: 'unpaid' });
            const appointment = await Appointment.findByIdAndUpdate(billinUpdate.appointmentId, { status: 'booked' });
            Responder.success(res, 'success');
        } catch (err) {
            console.log(err);
            Responder.operationFailed(res, err)
        }
    }
    
}
module.exports = {
    createLink: BaseController.get(PaymentController, 'createLink'),
    response: BaseController.get(PaymentController, 'response'),
    statusCheck: BaseController.get(PaymentController, 'statusCheck'),
    paypal: BaseController.get(PaymentController, 'paypal'),
    paypalSuccess: BaseController.get(PaymentController, 'paypalSuccess'),
    paypalFaild: BaseController.get(PaymentController, 'paypalFaild'),
    echeck: BaseController.get(PaymentController, 'echeck')
}