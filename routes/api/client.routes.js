const express = require('express');
const controller = require('../../controllers/api/client.controller');
const authorizeClient =require('../../lib/authorizeClient');
const Multer = require('multer');

const router = express.Router();

var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".")[1];
    const img1 = Date.now()+"."+ext;
    console.log(file,ext)
    cb(null, img1)
  }
})
var upload = Multer({ storage: storage }) 

router.post('/sign_up', controller.signUp);
router.post('/create', controller.signUp_manual);
router.post('/add_adult', authorizeClient, controller.addAdult);
router.get('/adult', authorizeClient, controller.getAdult);
router.patch('/',upload.single('idCopy'), authorizeClient, controller.update);
router.get('/', authorizeClient, controller.info);
router.get('/relations', authorizeClient, controller.allRelation);
router.get('/user_by_uid/:uid', authorizeClient, controller.getUserByUid);
router.put('/verify_otp', controller.verifyOTP);
router.put('/resend_otp', controller.resendOTP);
router.delete('/', authorizeClient, controller.deleteuser);
router.get('/get_user_info/:id', controller.getUserInfo);
module.exports = router;