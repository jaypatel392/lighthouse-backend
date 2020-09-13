const express = require('express');
const router = express.Router();
const authorizeUser = require('../../lib/authorizeUser');

const userRoutes = require('./user.routes');
const clientRoutes = require('./client.routes'); 
const appointmentRoutes = require('./appointment.routes');
const serviceRoutes = require('./services.routes');
const billingRoutes = require('./billing.routes');
const rcadsRoutes = require('./rcads.routes');
const paymentRoutes = require('./payment.routes');
const onboardingRoutes = require('./onbarding.routes');
const HealthAssessmentRoutes = require('./HealthAssessment.routes');
const assessmentRoutes = require('./assessment.routes');
const notificationRoutes = require('./notification.routes');
const childRoutes = require('./child.routes');

router.get('/', async (req, res) => {
  console.log('looog',req.query);
  
  res.status(200).send({ result: 'OK' });
});

router.use('/user', userRoutes);
router.use('/client', clientRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/services', authorizeUser, serviceRoutes);
router.use('/billing', billingRoutes);
router.use('/rcads', rcadsRoutes);
router.use('/payment', paymentRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/health_assessment', HealthAssessmentRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/notification', notificationRoutes);
router.use('/child', childRoutes);
module.exports = router;
