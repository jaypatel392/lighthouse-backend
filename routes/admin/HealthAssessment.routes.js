const express = require('express');
const controller = require('../../controllers/admin/mentalHealthAsses.controller');
const authorizeaAdmin =require('../../lib/authorizeaAdmin');
const { route } = require('../api/onbarding.routes');
const router = express.Router();

router.post('/', authorizeaAdmin, controller.add);
router.get('/complete_assessment', authorizeaAdmin, controller.completeAssessment);
router.get('/mental_health', authorizeaAdmin, controller.healthAssessment);
router.patch('/:id', authorizeaAdmin, controller.update);
router.get('/:id', authorizeaAdmin, controller.getById);
module.exports = router;