const express = require('express');
const controller = require('../../controllers/api/onboarding.controller');
const authorizeClient  = require('../../lib/authorizeClient');

const router = express.Router();

router.get('/', /* authorizeClient, */ controller.home);

module.exports = router;