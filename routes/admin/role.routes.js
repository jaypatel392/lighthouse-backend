const express = require('express');
const controller = require('../../controllers/admin/role.controller');

const router = express.Router();

router.get('/', controller.home);
router.post('/', controller.add);
router.patch('/:id', controller.update);
router.get('/:id', controller.getById);
router.delete('/:id', controller.delete);
router.patch('/:roleId/scopes', controller.updateRolePermission);

module.exports = router;