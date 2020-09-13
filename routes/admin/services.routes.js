const express = require('express');
const controller = require('../../controllers/admin/services.controller');

const router = express.Router();

router.get('/', controller.home);
router.get('/:id', controller.getById);
router.post('/',controller.add);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);


module.exports = router;