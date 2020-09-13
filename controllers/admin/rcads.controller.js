const { of } = require('await-of');
const BaseController = require('../api/base.controller');
const Responder = require('../../lib/expressResponder');
const RcadQ = require('../../models/rcadQ.model');

class RcadQController extends BaseController {
    constructor() {
        super()
        console.log('Rcade init');
    }
    home = async (req, res) => {
        const pageNo = req.query.pageNo - 1;
        const [ result, err ] = await of(RcadQ.find({ status: 'active' }).sort({ createdAt: -1 }).skip(pageNo*10).limit(10));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }
    add = async (req, res) => {
        const data = {
            ...req.body,
            status : 'active'
        }
        const rcade = new RcadQ(data);
        const [ result, err ] = await of(rcade.save());
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, 'success')
    }
    update = async (req, res) => {
        const data = {
            ...req.body,
        }
        const [ result, err ] = await of(RcadQ.findByIdAndUpdate(req.params.id, data));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, 'success');
    }
    getById = async (req, res) => {
        const [ result, err ] = await of(RcadQ.findById(req.params.id));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }
    delete = async (req, res) => {
        const [ result, err ] = await of(RcadQ.findByIdAndUpdate(req.params.id, { status: 'deleted' }));
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.deleted(res, result)
    }
}
module.exports = {
    home: BaseController.get(RcadQController, 'home'),
    add: BaseController.get(RcadQController, 'add'),
    update: BaseController.get(RcadQController, 'update'),
    getById: BaseController.get(RcadQController, 'getById'),
    delete: BaseController.get(RcadQController, 'delete')
}
