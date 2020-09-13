const express = require('express');
const controller = require('../../controllers/api/payment.controller');
const authorizeUser = require('../../lib/authorizeUser');
const router = express.Router();

router.post('/:appointmentId/create', controller.createLink);
router.post('/response', controller.response);
router.get('/response', controller.response);
router.get('/:billingId/status', controller.statusCheck);
router.get('/:appointmentId/paypal', controller.paypal);
router.get('/paypal_success', controller.paypalSuccess);
router.get('/paypal_fail', controller.paypalFaild);
router.get('/:appointmentId/echeck', controller.echeck);

module.exports = router;