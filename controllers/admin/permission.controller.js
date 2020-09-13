const { of } = require('await-of');
const Basecontroller = require('../api/base.controller');
const Role = require('../../models/role.model');
const Permission = require('../../models/permission.model');
const Responder = require('../../lib/expressResponder');

class PermissionController extends Basecontroller {
  constructor() {
    super()
  }

  home = async (req, res) => {
    const [ result, err ] = await of(Permission.find({ 
      status: 'active' 
    })
    .populate({
      path: 'role',
      model: 'Role'
    }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  add = async (req, res) => {
    const data = {
      ...req.body,
      status: 'active'
    }
    const permission = new Permission(data);
    const [ result, err ] = await of(permission.save());
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, 'success')
  }

  update = async (req, res) => {
    const [ result, err ] = await of(Permission.findByIdAndUpdate(req.params.id, req.body));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, 'success');
  }

  getByid = async (req, res) => {
    const [ result, err ] = await of(Permission.findById(
      req.params.id
      )
      .populate({
        path: 'role',
        model: 'Role'
      }));
    if (err) {
      Responder.operationFailed(res, err);
    }
    Responder.success(res, result);
  }

  delete = async (req, res) => {
    const [ result, err ] = await of(Permission.findByIdAndUpdate(req.params.id, { status: 'deleted' }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.deleted(res. result)
  }
  
  byRole = async (req, res) => {
    const [ result, err ] = await of(Permission.find({ 
      role: req.params.id 
    })
    .populate({
      path: 'role',
      model: 'Role'
    }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }
}

module.exports = {
  home: Basecontroller.get(PermissionController, 'home'),
  add : Basecontroller.get(PermissionController, 'add'),
  delete: Basecontroller.get(PermissionController, 'delete'),
  update: Basecontroller.get(PermissionController, 'update'),
  getByid: Basecontroller.get(PermissionController, 'getByid'),
  byRole: Basecontroller.get(PermissionController, 'byRole')
}