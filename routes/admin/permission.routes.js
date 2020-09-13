const express = require('express');
const controller = require('../../controllers/admin/permission.controller');

const router = express.Router();

router.get('/', controller.home);
router.post('/', controller.add);
router.patch('/:id', controller.update),
router.get('/:id', controller.getByid),
router.get('/:id/role', controller.byRole),
router.delete('/:id', controller.delete)

module.exports = router;