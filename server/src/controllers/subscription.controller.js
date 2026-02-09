const Order = require('../models/order.model');
const Listing = require('../models/listing.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createSubscription = catchAsync(async (req, res, next) => {
    const { listingId, interval } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return next(new AppError('Listing not found', 404));

    if (listing.pricingModel === 'one_time') {
        return next(new AppError('This listing is not a subscription', 400));
    }

    const startDate = new Date();
    const nextBillingDate = new Date();
    if (interval === 'month') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else if (interval === 'year') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    } else {
        // Default to pricing model
        if (listing.pricingModel === 'subscription_monthly') nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        if (listing.pricingModel === 'subscription_yearly') nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    const newOrder = await Order.create({
        buyerId: req.user.id,
        sellerId: listing.sellerId,
        listingId: listing._id,
        type: 'subscription',
        status: 'completed', // Assuming instant "payment" for now
        amount: listing.price,
        subscription: {
            interval: interval || (listing.pricingModel.includes('month') ? 'month' : 'year'),
            startDate: startDate,
            nextBillingDate: nextBillingDate,
            isActive: true,
            status: 'active'
        }
    });

    res.status(201).json({
        status: 'success',
        data: {
            subscription: newOrder
        }
    });
});

exports.getMySubscriptions = catchAsync(async (req, res, next) => {
    // Lazy check for expiry on read
    const now = new Date();

    // Find active subscriptions that are past due
    await Order.updateMany(
        {
            buyerId: req.user.id,
            type: 'subscription',
            "subscription.status": 'active',
            "subscription.nextBillingDate": { $lt: now }
        },
        {
            // In a real system, we'd trigger renewal here. 
            // For this scope, we mark expired if no auto-renew logic runs.
            // But spec says "If nextBillingDate < today -> mark expired"
            $set: { "subscription.status": "expired", "subscription.isActive": false }
        }
    );

    const subscriptions = await Order.find({
        buyerId: req.user.id,
        type: 'subscription'
    })
        .populate({
            path: 'listingId',
            select: 'title images price category'
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: subscriptions.length,
        data: {
            subscriptions
        }
    });
});

exports.cancelSubscription = catchAsync(async (req, res, next) => {
    const subscription = await Order.findOne({
        _id: req.params.id,
        buyerId: req.user.id,
        type: 'subscription'
    });

    if (!subscription) {
        return next(new AppError('Subscription not found', 404));
    }

    if (subscription.subscription.status !== 'active') {
        return next(new AppError('Subscription is not active', 400));
    }

    // Cancel at end of period
    subscription.subscription.status = 'cancelled';
    subscription.subscription.endDate = subscription.subscription.nextBillingDate;
    // Remains isActive=true until cron job checks endDate? 
    // Or we consider it "cancelled" immediately but "benefits" active.
    // Spec: "Cancelled: Remains active until endDate"
    // So we keep isActive=true, but status='cancelled'

    await subscription.save();

    res.status(200).json({
        status: 'success',
        data: {
            subscription
        }
    });
});

exports.resumeSubscription = catchAsync(async (req, res, next) => {
    const subscription = await Order.findOne({
        _id: req.params.id,
        buyerId: req.user.id,
        type: 'subscription'
    });

    if (!subscription) return next(new AppError('Subscription not found', 404));

    if (subscription.subscription.status !== 'cancelled') {
        return next(new AppError('Subscription is not cancelled', 400));
    }

    // Check if still within valid period
    if (new Date() > subscription.subscription.endDate) {
        return next(new AppError('Subscription has already expired', 400));
    }

    subscription.subscription.status = 'active';
    subscription.subscription.endDate = undefined;
    await subscription.save();

    res.status(200).json({
        status: 'success',
        data: {
            subscription
        }
    });
});

// Admin / Stats
exports.getSellerSubscribers = catchAsync(async (req, res, next) => {
    const subscribers = await Order.find({
        sellerId: req.user.id,
        type: 'subscription'
    })
        .populate('buyerId', 'profile.firstName profile.lastName email profile.avatarUrl')
        .populate('listingId', 'title')
        .sort('-createdAt'); // Most recent first

    res.status(200).json({
        status: 'success',
        results: subscribers.length,
        data: {
            subscribers
        }
    });
});

exports.getSellerStats = catchAsync(async (req, res, next) => {
    const stats = await Order.aggregate([
        { $match: { sellerId: req.user._id, type: 'subscription' } },
        {
            $group: {
                _id: null,
                totalSubscribers: { $sum: 1 }, // This counts total ever. We need active.
                activeSubscribers: {
                    $sum: { $cond: [{ $eq: ["$subscription.status", "active"] }, 1, 0] }
                },
                mrr: {
                    $sum: {
                        $cond: [
                            { $eq: ["$subscription.status", "active"] },
                            { $cond: [{ $eq: ["$subscription.interval", "year"] }, { $divide: ["$amount", 12] }, "$amount"] },
                            0
                        ]
                    }
                }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats: stats[0] || { activeSubscribers: 0, mrr: 0 }
        }
    });
});

exports.getAdminSubscriptionStats = catchAsync(async (req, res, next) => {
    const stats = await Order.aggregate([
        { $match: { type: 'subscription' } },
        {
            $group: {
                _id: null,
                totalSubscribers: { $sum: 1 },
                activeSubscribers: {
                    $sum: { $cond: [{ $eq: ["$subscription.status", "active"] }, 1, 0] }
                },
                mrr: {
                    $sum: {
                        $cond: [{ $eq: ["$subscription.status", "active"] },
                        { $cond: [{ $eq: ["$subscription.interval", "year"] }, { $divide: ["$amount", 12] }, "$amount"] },
                            0
                        ]
                    }
                }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats: stats[0] || { totalSubscribers: 0, activeSubscribers: 0, mrr: 0 }
        }
    });
});

exports.processRenewals = catchAsync(async (req, res, next) => {
    // 🟡 PART 3: SUBSCRIPTION AUTOMATION COMPLETION
    // This would typically run via a Cron Job (e.g. every midnight)

    const now = new Date();
    const results = { renewed: 0, expired: 0 };

    // 1. Handle Active Renewals (Mock Payment)
    const dueSubscriptions = await Order.find({
        type: 'subscription',
        "subscription.status": 'active',
        "subscription.nextBillingDate": { $lte: now }
    });

    for (const sub of dueSubscriptions) {
        // Mock Charge Logic: Always succeeds for this demo
        const isMonthly = sub.subscription.interval === 'month';

        // Update Next Billing Date
        if (isMonthly) {
            sub.subscription.nextBillingDate.setMonth(sub.subscription.nextBillingDate.getMonth() + 1);
        } else {
            sub.subscription.nextBillingDate.setFullYear(sub.subscription.nextBillingDate.getFullYear() + 1);
        }

        // 🔵 PART 4: NOTIFICATION EVENT (Simulated)
        console.log(`[EVENT: RENEWAL] Subscription ${sub._id} renewed. Charged ${sub.amount} ${sub.currency}.`);

        await sub.save();
        results.renewed++;
    }

    // 2. Handle Cancellations turning into Expirations
    const cancelledSubscriptions = await Order.find({
        type: 'subscription',
        "subscription.status": 'cancelled', // User cancelled, but period wasn't over
        "subscription.endDate": { $lte: now }, // Now period IS over
        "subscription.isActive": true
    });

    for (const sub of cancelledSubscriptions) {
        sub.subscription.isActive = false;
        sub.subscription.status = 'expired';

        // 🔵 PART 4: NOTIFICATION EVENT (Simulated)
        console.log(`[EVENT: EXPIRY] Subscription ${sub._id} expired.`);

        await sub.save();
        results.expired++;
    }

    res.status(200).json({
        status: 'success',
        message: 'Subscription lifecycle processed',
        data: results
    });
});
