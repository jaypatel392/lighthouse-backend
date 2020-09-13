const express = require('express');
const controller = require('../../controllers/api/notification.controller');
const authorizeClient = require('../../lib/authorizeClient');
const router = express.Router();

router.get('/', authorizeClient, controller.home);
router.post('/', authorizeClient, controller.add);
router.get('/:notificationId', controller.update);

module.exports = router;