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
        const pageNo = req.query.pageNo - 1;
        const [ result, err ] = await of(Onboarding.find().sort({ createdAt: -1 }).skip(pageNo*10).limit(10));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }
    add = async (req, res) => {
        const data = {
            ...req.body,
        }
        if (req.file) {
            data.image = req.file.filename
        }
        const onboarding = new Onboarding(data);
        const [ result, err ] = await of(onboarding.save());
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, 'success')
    }
    update = async (req, res) => {
        const data = {
            ...req.body,
        }
        if (req.file) {
            data.image = req.file.filename
        }
        const [ result, err ] = await of(Onboarding.findByIdAndUpdate(req.params.id, data));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, 'success');
    }
    getById = async (req, res) => {
        const [ result, err ] = await of(Onboarding.findById(req.params.id));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }
    delete = async (req, res) => {
        const [ result, err ] = await of(Onboarding.findByIdAndDelete(req.params.id));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.deleted(res, result)
    }
}
module.exports = {
    home: BaseController.get(OnboardingController, 'home'),
    add: BaseController.get(OnboardingController, 'add'),
    update: BaseController.get(OnboardingController, 'update'),
    getById: BaseController.get(OnboardingController, 'getById'),
    delete: BaseController.get(OnboardingController, 'delete')
}
