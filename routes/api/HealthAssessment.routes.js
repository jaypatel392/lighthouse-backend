const express = require('express');
const controller = require('../../controllers/api/mentalHealthAsses.controller');
const authorizeClient =require('../../lib/authorizeClient');
const router = express.Router();

router.get('/mental_health', /* authorizeClient ,*/ controller.healthAssessment);
router.get('/complete_assessment', /* authorizeClient, */ controller.completeAssessment);
module.exports = router;