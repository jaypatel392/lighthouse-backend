const express = require('express');
const controller = require('../../controllers/api/rcads.controller');
const authorizeUser = require('../../lib/authorizeUser');
const router = express.Router();

router.post('/', authorizeUser, controller.add);
router.get('/', authorizeUser,controller.getQus);

module.exports = router;