const { of } = require('await-of');
const Notification = require('../../models/notification.model');
const Responder = require('../../lib/expressResponder');
const BaseController = require('./base.controller');
require('../../lib/authorizeClient')

class NotificationController extends BaseController {
  constructor () {
    super ()
  }
  
  home = async (req, res) => {
    const [ result, err ] = await of(Notification.find({ for : req.client._id }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  add = async (req, res) => {
    const [ result, err ] = await of(new Notification({...req.body, for: req.client._id}).save());
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  update = async (req, res) => {
    const [ result, err ] = await of(Notification.findByIdAndUpdate(req.params.notificationId, { status: 'seen' }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }
} 
module.exports = {
  home: BaseController.get(NotificationController, 'home'),
  add: BaseController.get(NotificationController, 'add'),
  update: BaseController.get(NotificationController, 'update')
}