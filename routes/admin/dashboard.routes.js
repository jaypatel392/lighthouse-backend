const express = require('express');
const authorizeUser = require('../../lib/authorizeUser');
const controller = require('../../controllers/admin/dashboard.controller');

const router = express.Router();

router.get('/', controller.home);
router.get('/menu', controller.menu)


module.exports = router;