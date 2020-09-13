const { of } = require('await-of');
const Responder = require('../../lib/expressResponder');
const HealthAssessment = require('../../models/Healthassess.model');
const BaseController = require('../api/base.controller');

class HealthAssessmentController extends BaseController {
    constructor() {
        super()
    }

    healthAssessment = async (req, res) => {
        const [ result, err ] = await of(HealthAssessment.findOne({ status: 'active', for: 'mentalHealthAssessment' }).sort({ updatedAt: -1 }));
        if (err) {
            Responder.operationFailed(res, err)
        }    
        Responder.success(res, result)
    }

    completeAssessment = async (req, res) => {
        const [ result, err ] = await of(HealthAssessment.findOne({ status: 'active',  for: 'completeAssessment' }).sort({ updatedAt: -1 }));
        if (err) {
            Responder.operationFailed(res, err)
        }    
        Responder.success(res, result)
    }
}
module.exports = {
    healthAssessment: BaseController.get(HealthAssessmentController, 'healthAssessment'),
    completeAssessment: BaseController.get(HealthAssessmentController, 'completeAssessment'),
}