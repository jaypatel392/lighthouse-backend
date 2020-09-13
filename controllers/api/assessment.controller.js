const { of } = require('await-of');
const Assessemnt = require('../../models/assessment.model');
const AssessmentAns = require('../../models/assessmentAns.model');
const Responder = require('../../lib/expressResponder');
const BaseController = require('./base.controller');
require('../../lib/authorizeClient')
class AssessmentController extends BaseController {
  constructor () {
    super ()
  }
  
  home = async (req, res) => {
    const [ result, err ] = await of(Assessemnt.find({ status: 'active' }));
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result);
  }

  ans = async (req, res) => {
    console.log(req.client);
    
    const [ result, err ] = await of(new AssessmentAns({...req.body, client: req.client}).save());
    if (err) {
      Responder.operationFailed(res, err)
    }
    Responder.success(res, result)
  }
} 
module.exports = {
  home: BaseController.get(AssessmentController, 'home'),
  ans: BaseController.get(AssessmentController, 'ans')
}