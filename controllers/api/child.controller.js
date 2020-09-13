const { of } = require('await-of');
const BaseController = require('./base.controller');
const Responder = require('../../lib/expressResponder');
const admin = require('firebase-admin');
const Child = require('../../models/child.model');
require('../../lib/authorizeClient');

class ChildController extends BaseController {
  constructor() {
    super();
    console.log('Initializing contoller');
  }
  add = async (req, res) => {
    const data = {
      ...req.body,
      clientId: req.client._id,
      status: 'active'
    }
    const [child, err] = await of(new Child(data).save());
    if (err) Responder.operationFailed(res, err);
    Responder.success(res, child)
  }

  home = async (req, res) => {
    const [result, err] = await of(Child.find({ clientId: req.client._id }));
    if (err) Responder.operationFailed(res, err);
    Responder.success(res, result)
  }

  getById = async (req, res) => {
    const [result, err] = await of(Child.findById(req.params.childId));
    if (err) Responder.operationFailed(res, err)
    Responder.success(res, result)
  }

  update = async (req, res) => {
    const [ result, err ] = await of(Child.findByIdAndUpdate(req.params.childId, {...req.body}));
    if (err) Responder.operationFailed(res, err)
    Responder.success(res, result)
  }

}

module.exports = {
  add: BaseController.get(ChildController, 'add'),
  home: BaseController.get(ChildController, 'home'),
  getById: BaseController.get(ChildController, 'getById'),
  update: BaseController.get(ChildController, 'update')
};
