const express = require('express');
const controller = require('../../controllers/admin/scope.controller');

const router = express.Router();

router.get('/', controller.home);
router.post('/', controller.add);

module.exports = router;