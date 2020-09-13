const express = require('express');
const authorizeAdmin = require('../../lib/authorizeaAdmin');
const dashboardRoutes = require('./dashboard.routes');
const servicesRoutes = require('./services.routes');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const permissionRoutes = require('./permission.routes');
const rcadeRoutes = require('./rcadeq.routes');
const scopeRoutes = require('./scope.routes');
const onboardingRoutes = require('./onbarding.routes');
const healthAssessmentRoutes = require('./HealthAssessment.routes');
const { route } = require('../api/onbarding.routes');
const assessmentRoutes = require('./assessment.routes');

const router = express.Router();

router.get('/', authorizeAdmin, async (req, res) => {
    res.status(200).send({ result: 'OK' });
});
  
router.use('/dashboard', authorizeAdmin,  dashboardRoutes);
router.use('/services', authorizeAdmin, servicesRoutes);
router.use('/user', userRoutes);
router.use('/role', /* authorizeAdmin, */ roleRoutes);
router.use('/permission', authorizeAdmin, permissionRoutes);
router.use('/rcad_qus' , rcadeRoutes);
router.use('/scope', scopeRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/health_assessment', healthAssessmentRoutes);
router.use('/assessment', assessmentRoutes);

module.exports = router;
