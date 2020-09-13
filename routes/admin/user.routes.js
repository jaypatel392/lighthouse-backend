const express = require('express');
const authorizeAdmin = require('../../lib/authorizeaAdmin');
const controller = require('../../controllers/admin/user.controller');

const router = express.Router();

router.get('/', controller.home);
router.post('/', /* authorizeAdmin, */ controller.add);
router.patch('/:id', authorizeAdmin, controller.update);
router.get('/:id', authorizeAdmin, controller.getById);
router.patch('/', controller.verify);


module.exports = router;