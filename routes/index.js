var express = require('express');
var router = express.Router();
var cors = require('cors');
const apiRoutes = require('./api/index.routes');
const adminRoutes = require('./admin/index.routes');
/* GET home page. */

router.use('/api', cors(), apiRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
