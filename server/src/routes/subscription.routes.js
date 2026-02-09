const express = require('express');
const subscriptionController = require('../controllers/subscription.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

router.post('/', subscriptionController.createSubscription);
router.get('/my-subscriptions', subscriptionController.getMySubscriptions);
router.patch('/:id/cancel', subscriptionController.cancelSubscription);
router.patch('/:id/resume', subscriptionController.resumeSubscription);

// Seller / Admin routes
router.get('/seller-stats', authMiddleware.restrictTo('seller', 'admin'), subscriptionController.getSellerStats);
router.get('/seller-subscribers', authMiddleware.restrictTo('seller', 'admin'), subscriptionController.getSellerSubscribers);
// Admin Routes
router.get('/admin-stats', authMiddleware.restrictTo('admin'), subscriptionController.getAdminSubscriptionStats);
router.post('/process-renewals', authMiddleware.restrictTo('admin'), subscriptionController.processRenewals);

module.exports = router;
