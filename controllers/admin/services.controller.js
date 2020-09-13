const { of } = require('await-of');
const BaseController = require('../api/base.controller');
const Service = require('../../models/services.model');
const Responder = require('../../lib/expressResponder');
require('../../lib/authorizeUser')

class ServicesController extends BaseController {
  constructor() {
    super();

    console.log('Initializing user contoller');
  }

  home = async (req, res) => {
    const [ services, err ] = await of(Service.find({ status: 'active'}));
    if (err) {
      Responder.operationFailed(res, err);
    }
    Responder.success(res, services)
  }

  add = async (req, res) => {
    const data = {
      ...req.body,
      status: 'active',
      type: 'admin'
    }
    const service = new Service(data);
    const [ result, err ] = await of(service.save());
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, 'success');
  }

  getById = async (req, res) => {
    const [result, err] = await of(Service.findById(req.params.id));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  update = async (req, res) => {
    const data = {
      ...req.body
    }
    const [ result, err ] = await of(Service.findByIdAndUpdate(req.params.id, data));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, 'success');
  }

  delete = async (req, res) => {
    const [ result, err ] = await of(Service.findByIdAndUpdate(req.params.id, { status: 'deleted' }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.deleted(res, 'success')
  }
}

module.exports = {
  home: BaseController.get(ServicesController, 'home'),
  add: BaseController.get(ServicesController, 'add'),
  update: BaseController.get(ServicesController, 'update'),
  delete: BaseController.get(ServicesController, 'delete'),
  getById: BaseController.get(ServicesController, 'getById')
};