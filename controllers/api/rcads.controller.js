const { of } = require('await-of');
const BaseController = require('../api/base.controller');
const Rcads = require('../../models/rcads.model');
const RcadsQ = require('../../models/rcadQ.model');
const User = require('../../models/user.model');
const Responder = require('../../lib/expressResponder');
require('../../lib/authorizeUser')

class RcadsController extends BaseController {
    constructor() {
        super() 
        console.log('rcade intialize--');
    }
    home = async (req, res) => {
        const [ result, err ] = await of(Rcads.find());
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }

    add = async (req, res) => {
        const data = {
            ...req.body,
            client: req.user._id    
        }
        const rcads = new Rcads(data)
        let [ rcad, err ] = await of(rcads.save())
        if (err) {
            Responder.operationFailed(res, err)
        }
        if (rcad) {
            const [ users, err ] = await of(User.find({ status : 'active', role: '5ead583b59f17934c6ab20ff'}));
            if (err) {
                Responder.operationFailed(res, err)
            }
            const data = {
                users,
                rcad
            }
            Responder.success(res, data)
        }
    }

    getQus = async (req, res) => {
        const [result, err] = await of(RcadsQ.find());
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }

}
module.exports = {
    home: BaseController.get(RcadsController, 'home'),
    add: BaseController.get(RcadsController, 'add'),
    getQus: BaseController.get(RcadsController, 'getQus')
}