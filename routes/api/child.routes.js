const express = require('express');
const controller = require('../../controllers/api/child.controller');
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

router.post('/', authorizeClient, controller.add);
router.get('/', authorizeClient, controller.home);
router.get('/:childId', authorizeClient, controller.getById);
router.patch('/:childId', authorizeClient, controller.update);
module.exports = router;