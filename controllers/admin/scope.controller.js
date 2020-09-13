const { of } = require('await-of');
const Scope = require('../../models/scope.model');
const BaseController = require('../api/base.controller');
const Responder = require('../../lib/expressResponder');

class ScopeController extends BaseController {
    constructor() {
        super()
        console.log('Scope controllee');
    }
    add = async (req, res) => {
        const data = {
            ...req.body
        }
        const scope = new Scope(data);
        const [ result, err ] = await of(scope.save());
        if (err) {
            Responder.operationFailed(res, err)
        }
        Responder.success(res, result)
    }

    home = async (req, res) => {
        const [ result, err ] = await of(Scope.find());
        if (err) {
            Responder.operationFailed(res, err)
        } 
        Responder.success(res, result)
    }
} 
module.exports = {
    add: BaseController.get(ScopeController, 'add'),
    home: BaseController.get(ScopeController, 'home')
}