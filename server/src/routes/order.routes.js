const express = require('express');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', authMiddleware.restrictTo('admin'), orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.get('/my-orders', authMiddleware.restrictTo('buyer'), orderController.getMyOrders);
router.patch('/:id/cancel', authMiddleware.restrictTo('buyer'), orderController.cancelOrder);
router.get('/sales', authMiddleware.restrictTo('seller'), orderController.getSales);
router.get('/revenue-stats', authMiddleware.restrictTo('seller'), orderController.getSellerRevenueStats);

module.exports = router;
