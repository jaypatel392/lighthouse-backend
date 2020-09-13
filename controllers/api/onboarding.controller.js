const { of } = require('await-of');
const BaseController = require('../api/base.controller');
const Responder = require('../../lib/expressResponder');
const Onboarding = require('../../models/onboarding.model');

class OnboardingController extends BaseController {
    constructor() {
        super()
        console.log('Rcade init');
    }
    home = async (req, res) => {
        const [ result, err ] = await of(Onboarding.find());
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }
}
module.exports = {
    home: BaseController.get(OnboardingController, 'home'),
}
