const express = require('express');
const controller = require('../../controllers/api/assessment.controller');

const router = express.Router();

router.get('/', controller.get);
router.post('/', controller.get);

module.exports = router;