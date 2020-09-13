const express = require('express');
const authorizeUser = require('../../lib/authorizeaAdmin');
const controller = require('../../controllers/admin/assessment.controller');

const router = express.Router();

router.get('/', controller.home);
router.post('/',controller.add);
router.patch('/:assessmentId', controller.update);
router.delete('/:assessmentId',controller.delete);
router.get('/:assessmentId', controller.getById);

module.exports = router;