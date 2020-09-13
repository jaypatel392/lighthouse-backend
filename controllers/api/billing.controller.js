const { of } = require("await-of")
const BaseController = require('./base.controller');
const Billing = require('../../models/billing.model');
const Responder = require('../../lib/expressResponder');
require('../../lib/authorizeUser');

class BillingController extends BaseController {
  constructor() {
    super()
    console.log('biling controller');
  }
  home = async (req, res) => {
    const [result, err] = await of(Billing.find({ 
      user: req.user._id 
    })
    .populate({
      path: 'clientId',
      model: 'Client'
    })
    .populate({
      path: 'services',
      model: 'Services'
    }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  get = async (req, res) => {
    const [ result, err ] = await of(Billing.find({ 
      clientId : req.params.clientId 
    })
    .populate({
      path: 'clientId',
      model: 'Client'
    })
    .populate({
      path: 'services',
      model: 'Services'
    }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  getByid = async (req, res) => {
    const [ result, err ] = await of(Billing.findById(
      req.params.id
    )
    .populate({
      path: 'clientId',
      model: 'Client'
    })
    .populate({
      path: 'services',
      model: 'Services'
    })
    .populate({
      path: 'user',
      model: 'User',
      select: 'email phoneNumber firstName lastName'
    }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  unpaid = async (req, res) => {
    const [ result, err ] = await of(Billing.find({ status: 'unpaid', clientId: req.client._id})
      .populate({
        path: 'appointmentId',
        model: 'Appointment',
        populate : {
          path: 'clinicianId',
          model: 'User'
        }
      })
      .populate({
        path: 'clientId',
        model: 'Client'
      })
    );
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }
}
module.exports = {
  home: BaseController.get(BillingController, 'home'),
  get: BaseController.get(BillingController, 'get'),
  getByid: BaseController.get(BillingController, 'getByid'),
  unpaid: BaseController.get(BillingController, 'unpaid')
}
