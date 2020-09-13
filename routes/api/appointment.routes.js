const express = require('express');
const controller = require('../../controllers/api/appointment.controller');
const authorizeUser = require('../../lib/authorizeUser');
const authorizeClient = require('../../lib/authorizeClient');
const router = express.Router();

router.get('/upcomming', authorizeClient,  controller.upcomming);
router.get('/completed', authorizeClient,  controller.completed);
router.get('/:appointmentId/confirmation', controller.appoimentConfiremation);
router.get('/:appointmentId', /* authorizeClient, */ controller.getById);
router.post('/', authorizeClient, controller.addFirst);


router.get('/:id/client',authorizeUser, controller.byClient);
// router.post('/',authorizeUser, controller.add);
router.get('/',authorizeUser, controller.get);
router.get('/user/:userId', authorizeUser, controller.getByUser);
router.patch('/:appointmentId', authorizeUser, controller.update);
router.get('/:appointmentId/cancel', authorizeUser, controller.appointmentCancel);

module.exports = router;