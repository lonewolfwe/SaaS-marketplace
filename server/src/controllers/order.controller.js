const Order = require('../models/order.model');
const Listing = require('../models/listing.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find()
        .populate('buyerId', 'profile.firstName profile.lastName email profile.avatarUrl')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: { orders }
    });
});

exports.createOrder = catchAsync(async (req, res, next) => {
    const { listingId, amount, type = 'one_time' } = req.body;
    const buyerId = req.user.id;

    // 1) Verify Listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
        return next(new AppError('Listing not found', 404));
    }

    // 2) Verify User is not Seller
    if (listing.sellerId.toString() === buyerId) {
        return next(new AppError('You cannot buy your own listing', 400));
    }

    // 3) Create Order
    // In a real app, we would integrate Stripe here. 
    // For now, we simulate a successful transaction.
    const newOrder = await Order.create({
        buyerId,
        sellerId: listing.sellerId,
        listingId,
        type,
        amount,
        status: 'completed', // Auto-complete for MVP
        payment: {
            transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
            provider: 'stripe', // Mock
            status: 'paid'
        }
    });

    // 4) Update User Stats (Optional optimization)

    res.status(201).json({
        status: 'success',
        data: {
            order: newOrder
        }
    });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ buyerId: req.user.id })
        .populate({
            path: 'listingId',
            select: 'title images price category'
        })
        .populate({
            path: 'sellerId',
            select: 'profile.firstName profile.lastName profile.companyName'
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders
        }
    });
});

exports.getSales = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ sellerId: req.user.id })
        .populate({
            path: 'buyerId',
            select: 'profile.firstName profile.lastName email'
        })
        .populate({
            path: 'listingId',
            select: 'title price category'
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders
        }
    });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findOne({
        _id: req.params.id,
        buyerId: req.user.id
    });

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    if (order.type === 'subscription') {
        return next(new AppError('Use the subscription cancellation endpoint for subscriptions', 400));
    }

    if (order.status === 'cancelled') {
        return next(new AppError('Order is already cancelled', 400));
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});

exports.getSellerRevenueStats = catchAsync(async (req, res, next) => {
    const stats = await Order.aggregate([
        { $match: { sellerId: req.user._id, status: { $in: ['completed', 'refunded'] } } },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] }
                },
                totalOrders: { $sum: 1 },
                refundedAmount: {
                    $sum: { $cond: [{ $eq: ["$status", "refunded"] }, "$amount", 0] }
                },
                avgOrderValue: { $avg: "$amount" }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats: stats[0] || { totalRevenue: 0, totalOrders: 0, refundedAmount: 0, avgOrderValue: 0 }
        }
    });
});
