const { of } = require('await-of');
const Assessment = require('../../models/assessment.model');
const AssessmentAns = require('../../models/assessmentAns.model');
const Responder = require('../../lib/expressResponder');
const BaseController = require('../api/base.controller');

class AssessmentController extends BaseController {
  constructor () {
    super ()
  }
  home = async (req, res) => {
    const [ result, err ] = await of(Assessment.find({ status: 'active' }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  add = async (req, res) => {
    const [ result, err ] = await of(new Assessment({...req.body, status : 'active'}).save());
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  update = async (req, res) => {
    const [ result, err ] = await of(Assessment.findByIdAndUpdate(req.params.assessmentId, {...req.body}));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }

  getById = async (req, res) => {
    const [ result, err ] = await of(Assessment.findById(req.params.assessmentId));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  delete = async (req, res) => {
    const [ result, err ] = await of(Assessment.findByIdAndUpdate(req.params.assessmentId, { status: 'delete' }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

} 
module.exports = {
  home: BaseController.get(AssessmentController, 'home'),
  add: BaseController.get(AssessmentController, 'add'),
  delete: BaseController.get(AssessmentController, 'delete'),
  getById: BaseController.get(AssessmentController, 'getById'),
  update: BaseController.get(AssessmentController, 'update')
}