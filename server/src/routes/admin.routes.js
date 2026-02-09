const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/stats/overview', adminController.getDashboardStats);
router.get('/activity', adminController.getActivityFeed);
router.get('/analytics/charts', adminController.getChartData);

module.exports = router;
