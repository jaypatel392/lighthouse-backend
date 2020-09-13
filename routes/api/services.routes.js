const express = require('express');
const controller = require('../../controllers/api/services.controller');

const router = express.Router();

router.get('/admin', controller.getAdmin);
router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.add);
router.delete('/:id', controller.delete);
router.patch('/:id', controller.update);

module.exports = router;