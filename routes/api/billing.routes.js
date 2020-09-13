const express = require('express');
const controller = require('../../controllers/api/billing.controller');
const authorizeClient = require('../../lib/authorizeClient');

const router = express.Router();

router.get('/unpaid', authorizeClient, controller.unpaid)
router.get('/:id', controller.getByid);
router.get('/', controller.home);
router.get('/:clientId/client', controller.get);
module.exports = router;