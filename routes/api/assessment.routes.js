const express = require('express');
const controller = require('../../controllers/api/assessment.controller');
const auth = require('../../lib/authorizeClient');
const router = express.Router();

router.get('/', controller.home);
router.post('/', auth, controller.ans);
module.exports = router;