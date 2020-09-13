const express = require('express');
const authorizeUser = require('../../lib/authorizeUser');
const controller = require('../../controllers/api/user.controller');

const router = express.Router();

router.post('/login', controller.login);
router.post('/signUp', controller.signUp);
router.put('/verifyOTP', controller.verifyOTP);
router.put('/resendOTP', controller.resendOTP);
router.get('/check-user', controller.checkUserName),
router.get('/clinicians', controller.clinicians);
router.get('/:userId',authorizeUser, controller.getById)
module.exports = router;