const { of } = require('await-of');
const BaseController = require('../api/base.controller');
require('../../lib/authorizeUser')

class DashboardController extends BaseController {
  constructor() {
    super();

    console.log('Initializing user contoller');
  }

  home = async (req, res) => {
    const object = { title:'Admin Dashboard' };
    res.render('admin/home', object);
  }

  menu = async (req, res) => {
      const object = { title: 'DropDown menus'}
      res.render('admin/menus')
  }
}

module.exports = {
  home: DashboardController.get(DashboardController, 'home'),
  menu: DashboardController.get(DashboardController, 'menu'),
  
};