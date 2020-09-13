const { of } = require('await-of');
const BaseController = require('../api/base.controller');
const User = require('../../models/user.model');
const Sesson = require('../../models/session.model');
const Responder = require('../../lib/expressResponder');
const dayjs = require('dayjs')
require('../../lib/authorizeUser')

class UserController extends BaseController {
  constructor() {
    super();

    console.log('Initializing clinicial controller');
  }

  home = async (req, res) => {
    const [ result, err ] = await of(User.find({ status: 'active' }).select('firstName lastName email userName specialty status role'));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  add = async (req, res) => {
    const data = {
      ...req.body,
      status: 'active',
    }
    const user = new User(data);
    const [ result, err ] = await of(user.save());
    if (err) {
      Responder.operationFailed(res, err);
    }
    Responder.success(res, 'success');
  }

  update = async (req, res) => {
    const data = {
      ...req.body,
    }
    const [ result, err ] = await of(User.findByIdAndUpdate(req.params.id, data));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, 'success')
  }

  getById = async (req, res) => {
    const [ result, err ] = await of(User.findById(req.params.id).select('firstName lastName email userName specialty status role'));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  verify = async (req, res) => {
    const { token } = req.query
    console.log('time====>', dayjs(new Date()).toDate());
    
    const [ result, err ] = await of(Sesson.findOne({ 
      token,
      /* validTill: {
        $gte: dayjs(new Date()).toDate(),
      } */
    }));
   console.log('======>',result);
   
    if (result) {
      const data = {
        ...req.body,
        verify: true
      }
      const [ user, err ] = await of(User.findByIdAndUpdate(result.user, data));
      if (err) {
        Responder.operationFailed(res, err)
      }
      Responder.success(res, 'success')
    } else {
      Responder.operationFailed(res, 'Token Expire')
    }
  }
}

module.exports = {
  home: BaseController.get(UserController, 'home'),
  add: BaseController.get(UserController, 'add'),
  update: BaseController.get(UserController, 'update'),
  getById : BaseController.get(UserController, 'getById'),
  verify: BaseController.get(UserController, 'verify')
};