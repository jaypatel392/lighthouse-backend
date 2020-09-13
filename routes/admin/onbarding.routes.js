const express = require('express');
const controller = require('../../controllers/admin/onboarding.controller');
const authorizeUser  = require('../../lib/authorizeaAdmin');
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


router.get('/', authorizeUser, controller.home);
router.post('/', upload.single('image'), authorizeUser, controller.add);
router.patch('/:id',upload.single('image'), authorizeUser, controller.update),
router.get('/:id', authorizeUser, controller.getById),
router.delete('/:id', authorizeUser, controller.delete)

module.exports = router;