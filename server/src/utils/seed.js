const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Listing = require('../models/listing.model');
const Order = require('../models/order.model');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './.env' }); // Adjust path as needed based on where you run it

const SAMPLE_LISTINGS = [
    {
        title: "SaaS Analytics Pro",
        description: "Comprehensive analytics dashboard for SaaS founders. Track MRR, Churn, and LTV with one click integrations to Stripe and Paddle.",
        price: 49,
        category: "DevTools",
        priceModel: "subscription_monthly",
        images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"],
        status: "approved",
    },
    {
        title: "Email Marketing Blaster",
        description: "Send unlimited emails with high deliverability. Includes a drag-and-drop builder and AI-powered subject line generator.",
        price: 299,
        category: "Marketing",
        priceModel: "one_time",
        images: ["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"],
        status: "approved",
    },
    {
        title: "Design System UI Kit",
        description: "A complete Figma design system for React applications. Includes over 200 components, auto-layout ready, and dark mode support.",
        price: 89,
        category: "Design",
        priceModel: "one_time",
        images: ["https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&w=800&q=80"],
        status: "approved",
    },
    {
        title: "Project Management Hero",
        description: "The ultimate project management tool for remote teams. Kanban boards, Gantt charts, and real-time collaboration features.",
        price: 12,
        category: "Productivity",
        priceModel: "subscription_monthly",
        images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"],
        status: "approved",
    },
    {
        title: "FinTech API Starter",
        description: "Secure and compliant banking API wrapper. Get up and running with PLAID and Yodlee integrations in minutes.",
        price: 999,
        category: "Finance",
        priceModel: "one_time",
        images: ["https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80"],
        status: "approved",
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        const passwordHash = await bcrypt.hash('password123', 12);

        // 1. Find or Create Seller
        let seller = await User.findOne({ email: 'seller@example.com' });
        if (!seller) {
            seller = await User.create({
                email: 'seller@example.com',
                passwordHash,
                roles: ['seller'],
                profile: { firstName: 'Demo', lastName: 'Seller', companyName: 'Acme SaaS Co.' }
            });
            console.log('Created Demo Seller: seller@example.com');
        } else {
            console.log('Using existing Seller: seller@example.com');
        }

        // 2. Find or Create Buyer
        let buyer = await User.findOne({ email: 'buyer@example.com' });
        if (!buyer) {
            buyer = await User.create({
                email: 'buyer@example.com',
                passwordHash,
                roles: ['buyer'],
                profile: { firstName: 'Demo', lastName: 'Buyer' }
            });
            console.log('Created Demo Buyer: buyer@example.com');
        } else {
            console.log('Using existing Buyer: buyer@example.com');
        }

        // 3. Seed Listings (Idempotent-ish)
        let listings = await Listing.find({ sellerId: seller._id });
        if (listings.length === 0) {
            const listingsWithSeller = SAMPLE_LISTINGS.map(l => ({ ...l, sellerId: seller._id }));
            listings = await Listing.insertMany(listingsWithSeller);
            console.log(`Seeded ${listings.length} listings.`);
        } else {
            console.log(`Found ${listings.length} existing listings.`);
        }

        // 4. Seed Orders
        const orderCount = await Order.countDocuments();
        if (orderCount === 0 && listings.length > 0) {
            const orders = [
                // Completed One-Time Purchase
                {
                    buyerId: buyer._id,
                    sellerId: seller._id,
                    listingId: listings[1]._id, // Email Marketing Blaster (299)
                    type: 'one_time',
                    amount: 299,
                    status: 'completed',
                    payment: { provider: 'stripe', status: 'succeeded', transactionId: 'tx_123456789' }
                },
                // Active Subscription
                {
                    buyerId: buyer._id,
                    sellerId: seller._id,
                    listingId: listings[0]._id, // SaaS Analytics Pro (49/mo)
                    type: 'subscription',
                    amount: 49,
                    status: 'active',
                    payment: { provider: 'stripe', status: 'succeeded', transactionId: 'tx_sub_987654321' },
                    subscription: {
                        interval: 'month',
                        startDate: new Date(),
                        nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                        isActive: true
                    }
                },
                // Cancelled Subscription
                {
                    buyerId: buyer._id,
                    sellerId: seller._id,
                    listingId: listings[3]._id, // Project Management Hero (12/mo)
                    type: 'subscription',
                    amount: 12,
                    status: 'cancelled',
                    payment: { provider: 'paypal', status: 'succeeded', transactionId: 'tx_sub_cancelled' },
                    subscription: {
                        interval: 'month',
                        startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)),
                        isActive: false
                    }
                },
                // Refunded One-Time
                {
                    buyerId: buyer._id,
                    sellerId: seller._id,
                    listingId: listings[2]._id, // UI Kit
                    type: 'one_time',
                    amount: 89,
                    status: 'refunded',
                    payment: { provider: 'stripe', status: 'refunded', transactionId: 'tx_ref_55555' }
                }
            ];

            await Order.insertMany(orders);
            console.log(`Seeded ${orders.length} orders successfully.`);
        } else {
            console.log(`Detailed Orders already exist (${orderCount}). Skipping order seed.`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
