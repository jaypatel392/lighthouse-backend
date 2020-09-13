const { of } = require('await-of');
const Responder = require('../../lib/expressResponder');
const HealthAssessment = require('../../models/Healthassess.model');
const BaseController = require('../api/base.controller');

class HealthAssessmentController extends BaseController {
    constructor() {
        super()
    }

    healthAssessment = async (req, res) => {
        const [ result, err ] = await of(HealthAssessment.find({ for: 'mentalHealthAssessment' }));
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
        const [result, err] = await of(new HealthAssessment(data).save());
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }

    getById = async (req, res) => {
        const [ result, err ] = await of(HealthAssessment.findById(req.params.id));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result);
    }

    completeAssessment = async (req, res) => {
        const [ result, err ] = await of(HealthAssessment.find({ for: 'completeAssessment' }));
        if (err) {
            Responder.operationFailed(res, err)
        }    
        Responder.success(res, result);
    }

    update = async (req, res) => {
        const data = {
            ...req.body,
        }
        const [ result, err ] = await of(HealthAssessment.findByIdAndUpdate(req.params.id, data));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result);
    }

    home = async (req, res) => {
        const [result, err] = await of(HealthAssessment.find({}));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result);
    }
}
module.exports = {
    add: BaseController.get(HealthAssessmentController, 'add'),
    healthAssessment: BaseController.get(HealthAssessmentController, 'healthAssessment'),
    completeAssessment: BaseController.get(HealthAssessmentController, 'completeAssessment'),
    update: BaseController.get(HealthAssessmentController, 'update'),
    home: BaseController.get(HealthAssessmentController, 'home'),
    getById: BaseController.get(HealthAssessmentController, 'getById')
}