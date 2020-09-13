const { of } = require('await-of');
const dayjs = require('dayjs');
const times = require('lodash/times');
const BaseController = require('./base.controller');
const Appointment = require('../../models/appoiment.model');
const Responder = require('../../lib/expressResponder');
const SendMail = require('../../lib/sendMail');
const Client = require('../../models/client.model');
const User = require('../../models/user.model');
const Billing = require('../../models/billing.model');
require('../../lib/authorizeUser');
require('../../lib/authorizeClient');
const zoom = require('../../lib/zoom');

class ClientController extends BaseController {
  constructor() {
    super();
    console.log('Initializing user contoller');
  }

  add = async (req, res) => {
    const {
      recurring,
      recurringInterval,
      recurringEndType,
      recurringEndFrequency,
      recurringDaysOfWeek,
      recurringEndDate,
      ...appointment
    } = req.body;
    const user = req.user._id
    const appointments = []

    appointments.push(new Appointment({
      ...appointment,
      user,
    }))

    const startTime = dayjs(req.body.startTime)
    const endDate = dayjs(req.body.recurringEndDate)
    if (recurring) {
      let endFrequency = recurringEndFrequency
      if (recurringEndType === 'date') {
        endFrequency = 1;
        while (startTime.add(endFrequency * recurringInterval, 'week').isBefore(endDate)) {
          endFrequency += 1;
        }
      }

      times(endFrequency, (frequencyNumber) => {
        const week = startTime.add(recurringInterval, 'week')
          .add(frequencyNumber * recurringInterval, 'week');

        [].concat(recurringDaysOfWeek).forEach(dayNumber => {
          const nextStartTime = week
            .day(dayNumber)
            .hour(startTime.hour())
            .minute(startTime.minute())
            .second(startTime.second())

          if (
            !Boolean(recurringEndDate)
            || (recurringEndDate && nextStartTime.isBefore(endDate))
            || (recurringEndDate && nextStartTime.date() === endDate.date())
          ) {
            appointments.push(new Appointment({
              ...appointment,
              user,
              startTime: nextStartTime,
            }))
          }
        })
      })
    }

    try {
      const promises = appointments.map(app => app.save())
      const [results, error] = await of(Promise.all(promises))
      if (error) {
        throw error;
      }
      /* const data = {
        clinician: `${req.user.firstName} ${req.user.lastName}`,
        date: '07 May 2020',
        time: '11:55 AM',
        fee: '$ 200',
        address: "The Light House"
      }
      const confirmationMail = await SendMail.appointmentConfirmation(data); */

      Responder.success(res, results)
    } catch (error) {
      Responder.operationFailed(res, error);
    }
  }

  get = async (req, res) => {
    const [result, err] = await of(Appointment.find({ user: req.user._id })
      .populate({ path: 'clientId', model: 'Client', select: 'name' })
      .populate({ path: 'services', model: 'Services' }));

    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  getById = async (req, res) => {
    const [result, err] = await of(Appointment.findById(req.params.appointmentId)
      .populate({ path: 'clientId', model: 'Client' })
      .populate({ path: 'clinicianId', model: 'User' })
      .populate({ path: 'billingId', model: 'Billing' }))

    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  byClient = async (req, res) => {
    const [result, err] = await of(Appointment.find({
      clientId: req.params.id
    })
      .populate({
        path: 'services',
        model: 'Services'
      }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  getByUser = async (req, res) => {
    const [result, err] = await of(Appointment.find({ user: req.params.userId }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  addFirst = async (req, res) => {
    const data = {
      ...req.body,
      clientId: req.client._id,
      status: 'pending'
    }
    const appoiment = new Appointment(data);
    const [result, err] = await of(appoiment.save());
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  update = async (req, res) => {
    const [result, err] = await of(Appointment.findByIdAndUpdate(req.params.appoimentId, req.body));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  appointmentCancel = async (req, res) => {
    try {
      const appoiment = await Appointment.findById(req.params.appointmentId);
      const client = await Client.findById(appoiment.clientId);
      let status = client.status;

      const count = client.appointmentCancel;
      let refundAmount;
      let amount = appoiment.amount
      switch (count) {
        case 0:
          refundAmount = amount
          break;
        case 1:
          refundAmount = amount / 2
          break;
        case 2:
          refundAmount = 0
          break;
        case 3:
          refundAmount = 0,
            status = 'blocked'
      }
      console.log('refund', refundAmount);

      const increment = await Client.findByIdAndUpdate(client._id, { $inc: { appointmentCancel: 1, status } });

      if (increment) {
        const billing = await Billing.findOneAndUpdate({ appointmentId: req.params.appointmentId }, { status: 'completed', refundAmount })
      }
      const [result, err] = await of(Appointment.findByIdAndUpdate(req.params.appointmentId, { status: 'cancelled' }));
      if (err) {
        Responder.operationFailed(res, err)
      }
      Responder.success(res, result);
    } catch (err) {
      Responder.operationFailed(res, { message: 'There are no client' })
    }
  }

  appoimentConfiremation = async (req, res) => {
    const [result, err] = await of(Appointment.findById(req.params.appointmentId)
      .populate({
        path: 'clinicianId',
        model: 'User',
        select: 'address firstName lastName'
      })
      .populate({
        path: 'clientId',
        model: 'Client',
        select: 'email'
      })
      .select('clinicianId startTime duration duration'));
    console.log(result);

    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  upcomming = async (req, res) => {
    const [result, err] = await of(Appointment.find({ status: 'booked', clientId: req.client._id })
      .populate({
        path: 'clientId',
        model: 'Client'
      })
      .populate({
        path: 'clinicianId',
        model: 'User'
      })
      .populate({
        path: 'billingId',
        model: 'Billing'
      })
    );
    if (err) {
      Responder.operationFailed(res, err);
    }
    Responder.success(res, result)
  }

  completed = async (req, res) => {
    const [result, err] = await of(Appointment.find({ status: 'completed', clientId: req.client._id })
      .populate({
        path: 'clientId',
        model: 'Client'
      })
      .populate({
        path: 'clinicianId',
        model: 'User'
      })
      .populate({
        path: 'billingId',
        model: 'Billing'
      })
    );
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }
}

module.exports = {
  add: BaseController.get(ClientController, 'add'),
  get: BaseController.get(ClientController, 'get'),
  getById: BaseController.get(ClientController, 'getById'),
  byClient: BaseController.get(ClientController, 'byClient'),
  getByUser: BaseController.get(ClientController, 'getByUser'),
  addFirst: BaseController.get(ClientController, 'addFirst'),
  update: BaseController.get(ClientController, 'update'),
  appointmentCancel: BaseController.get(ClientController, 'appointmentCancel'),
  appoimentConfiremation: BaseController.get(ClientController, 'appoimentConfiremation'),
  upcomming: BaseController.get(ClientController, 'upcomming'),
  completed: BaseController.get(ClientController, 'completed')
};
