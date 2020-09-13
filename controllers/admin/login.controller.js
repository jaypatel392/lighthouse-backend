const { of } = require('await-of');
const BaseController = require('../api/base.controller');
require('../../lib/authorizeUser')

class LoginController extends BaseController {
  constructor() {
    super();

    console.log('Initializing user contoller');
  }

  login = async (req, res) => {
    const object = { title:'Admin Dashboard' };
    res.send('login');
  }
}

module.exports = {
  login: BaseController.get(LoginController, 'login'),
};