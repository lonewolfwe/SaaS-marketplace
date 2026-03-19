const User = require('../models/user.model');
const Listing = require('../models/listing.model');
const Order = require('../models/order.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 🔴 PART 1 & 6 — Core Metrics & Charts
exports.getDashboardStats = catchAsync(async (req, res, next) => {
    // 1. User Stats
    const userStats = await User.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                totalSellers: { $sum: { $cond: [{ $in: ['seller', '$roles'] }, 1, 0] } },
                totalBuyers: { $sum: { $cond: [{ $in: ['buyer', '$roles'] }, 1, 0] } },
                activeUsers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } }
            }
        }
    ]);

    // 2. Revenue & Subscription Stats (from Orders)
    const revenueStats = await Order.aggregate([
        {
            $facet: {
                totalRevenue: [
                    { $match: { status: 'completed' } },
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ],
                subscriptions: [
                    { $match: { type: 'subscription' } },
                    {
                        $group: {
                            _id: null,
                            totalActive: { $sum: { $cond: [{ $eq: ['$subscription.status', 'active'] }, 1, 0] } },
                            mrr: {
                                $sum: {
                                    $cond: [
                                        { $eq: ['$subscription.status', 'active'] },
                                        {
                                            $cond: [
                                                { $eq: ['$subscription.interval', 'year'] },
                                                { $divide: ['$amount', 12] },
                                                '$amount'
                                            ]
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        }
    ]);

    // 3. Listing Stats
    const listingStats = await Listing.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            users: userStats[0] || { totalUsers: 0, totalSellers: 0, activeUsers: 0 },
            revenue: {
                total: revenueStats[0].totalRevenue[0]?.total || 0,
                mrr: revenueStats[0].subscriptions[0]?.mrr || 0,
                activeSubs: revenueStats[0].subscriptions[0]?.totalActive || 0
            },
            listings: listingStats[0] || { total: 0, pending: 0, approved: 0, rejected: 0 }
        }
    });
});

// 🟡 PART 3 — Activity Feed
exports.getActivityFeed = catchAsync(async (req, res, next) => {
    // Combine recent creations/updates from different collections
    // Limit to 10 items

    // We'll mimic a union by fetching separately and sorting in memory for simplicity
    // A proper solution might use a dedicated ActivityLog collection populated via triggers

    const recentUsers = await User.find().sort('-createdAt').limit(5).select('profile createdAt roles');
    const recentListings = await Listing.find().sort('-createdAt').limit(5).select('title createdAt status sellerId').populate('sellerId', 'profile.firstName');
    const recentOrders = await Order.find().sort('-createdAt').limit(5).select('amount createdAt type status buyerId').populate('buyerId', 'profile.firstName');

    const activity = [
        ...recentUsers.map(u => ({
            type: 'user_register',
            message: `New ${u.roles[0]} registered: ${u.profile.firstName}`,
            time: u.createdAt,
            id: u._id
        })),
        ...recentListings.map(l => ({
            type: 'listing_create',
            message: `New listing: ${l.title}`,
            time: l.createdAt,
            id: l._id
        })),
        ...recentOrders.map(o => ({
            type: 'order',
            message: `New ${o.type}: $${o.amount}`,
            time: o.createdAt,
            id: o._id
        }))
    ]
        .sort((a, b) => b.time - a.time)
        .slice(0, 10);

    res.status(200).json({
        status: 'success',
        data: { activity }
    });
});

// 🟢 PART 6 — Charts Data
exports.getChartData = catchAsync(async (req, res, next) => {
    // Get revenue per day for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueChart = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo },
                status: 'completed'
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                value: { $sum: "$amount" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Fill missing days with 0
    // (Simplification: Client side or helper function can handle gap filling)

    res.status(200).json({
        status: 'success',
        data: {
            revenueOverTime: revenueChart.map(item => ({
                name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
                date: item._id,
                value: item.value
            }))
        }
    });
});

// 🔵 PART 7 — Platform Settings
const PlatformSettings = require('../models/platformSettings.model');

exports.getSettings = catchAsync(async (req, res, next) => {
    const settings = await PlatformSettings.getSettings();
    res.status(200).json({
        status: 'success',
        data: { settings }
    });
});

exports.updateSettings = catchAsync(async (req, res, next) => {
    const settings = await PlatformSettings.getSettings();

    if (req.body.maintenanceMode !== undefined) settings.maintenanceMode = req.body.maintenanceMode;
    if (req.body.registrationsOpen !== undefined) settings.registrationsOpen = req.body.registrationsOpen;
    if (req.body.fees) {
        if (req.body.fees.standard !== undefined) settings.fees.standard = req.body.fees.standard;
        if (req.body.fees.enterprise !== undefined) settings.fees.enterprise = req.body.fees.enterprise;
    }

    settings.updatedAt = Date.now();
    settings.updatedBy = req.user._id;
    await settings.save();

    res.status(200).json({
        status: 'success',
        data: { settings }
    });
});

// 🟣 PART 8 — Reports (Mock for now, but served from backend)
exports.getReports = catchAsync(async (req, res, next) => {
    // In a real app, this would query DB for specific time ranges and generate CSV/PDFs
    const reports = [
        { id: 1, title: "Financial Summary (Monthly)", description: "Revenue, payouts, and taxes for the selected month.", date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
        { id: 2, title: "User Growth Report", description: "New signups, churn rate, and LTV analysis.", date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
        { id: 3, title: "Content Moderation Log", description: "History of all flagged and removed listings.", date: "Last 30 Days" },
        { id: 4, title: "Platform Health Check", description: "System uptime, errors, and performance metrics.", date: "Real-time" },
    ];

    res.status(200).json({
        status: 'success',
        data: { reports }
    });
});
