const express = require('express');
const controller = require('../../controllers/admin/rcads.controller');
const authorizeAdmin = require('../../lib/authorizeaAdmin');

const router = express.Router();

router.get('/', controller.home);
router.post('/',authorizeAdmin, controller.add);
router.patch('/:id',authorizeAdmin, controller.update),
router.get('/:id',authorizeAdmin, controller.getById),
router.delete('/:id',authorizeAdmin, controller.delete)

module.exports = router;