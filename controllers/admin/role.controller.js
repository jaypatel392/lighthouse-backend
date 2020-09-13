const { of } = require('await-of');
const Basecontroller = require('../api/base.controller');
const Role = require('../../models/role.model');
const Permission = require('../../models/permission.model');
const Responder = require('../../lib/expressResponder');

class RoleController extends Basecontroller {
  constructor() {
    super()
  }

  home = async (req, res) => {
    const [ result, err ] = await of(Role.find({ status: 'active' }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  add = async (req, res) => {
    const data = {
      ...req.body,
      status: 'active',
    }
    const role = new Role(data);
    const [ result, err ] = await of(role.save());
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, 'success');
  }

  addScop = async (req, res) => {
    const data = {
      ...req.body,
      role: req.params.roleId,
      status: 'active'
    }
    const permission = new Permission(data);
    const [ result, err ] = await of(permission.save());
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, 'success')
  }

  updateRolePermission = async (req, res) => {
    const { scopes, permissions } = req.body;
    const data = { scopes, permissions }
    const [ result, err ] = await of(Role.findByIdAndUpdate(req.params.roleId, data));
    if (err) {
      Responder.operationFailed(res, err)
    } 
    Responder.success(res, result);
  }

  update = async (req, res) => {
    const [ result, err ] = await of(Role.findByIdAndUpdate(req.params.id, { role : req.body.role }));
    if (err) {
      Responder.operationFailed(res, err);
    }
    Responder.success(res, 'success');
  }

  delete = async (req, res) => {
    const [ result, err ] = await of(Role.findByIdAndUpdate(req.params.id, { status: 'deleted' }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.deleted(res, result);
  }
  
  getById = async (req, res) => {
    const [ result, err ] = await of(Role.findById(req.params.id).populate({ path: 'scopes', model: 'Api' }));
    if (err) {
      Responder.operationFailed(res, err);
    } 
    Responder.success(res, result);
  }
}

module.exports = {
  home: Basecontroller.get(RoleController, 'home'),
  add : Basecontroller.get(RoleController, 'add'),
  getById: Basecontroller.get(RoleController, 'getById'),
  delete: Basecontroller.get(RoleController, 'delete'),
  update: Basecontroller.get(RoleController, 'update'),
  updateRolePermission: Basecontroller.get(RoleController, 'updateRolePermission')
}