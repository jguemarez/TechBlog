const router = require('express').Router();

const apiRoutes = require('./apiRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/', apiRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;