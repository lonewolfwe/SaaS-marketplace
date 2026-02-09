const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('../models/listing.model');
const User = require('../models/user.model');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-marketplace';

const CATEGORIES = [
    'AI Tools', 'Marketing Automation', 'Analytics', 'Developer Tools',
    'Design Tools', 'Productivity SaaS', 'Security SaaS', 'Finance SaaS'
];

const ONE_TIME_PRICES = [29, 49, 79, 149, 299];
const MONTHLY_PRICES = [9, 19, 29, 49, 99];
const YEARLY_PRICES = [99, 199, 299, 499];

const SAAS_NAMES_PREFIX = ['AI', 'Smart', 'Cloud', 'Data', 'Cyber', 'Auto', 'Flow', 'Next', 'Hyper', 'Pro'];
const SAAS_NAMES_SUFFIX = ['Flow', 'Stack', 'Pulse', 'Forge', 'Pilot', 'Engine', 'Nest', 'Hub', 'Sync', 'Ware'];

const DESCRIPTIONS = [
    "The ultimate solution for scaling your business operations effortlessly.",
    "A powerful AI-driven platform to automate your daily workflows.",
    "Comprehensive analytics dashboard to track every metric that matters.",
    "Secure, scalable, and reliable infrastructure management tool.",
    "Design beautiful interfaces in minutes with our intuitive drag-and-drop editor.",
    "Financial forecasting made simple for startups and enterprises.",
    "Boost team productivity with seamless collaboration features.",
    "Protect your digital assets with enterprise-grade security protocols.",
    "Marketing automation engine to drive more leads and conversions.",
    "Developer-first toolset for rapid deployment and monitoring."
];

// Helper to pick random item
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate a realistic name
const generateName = () => `${rand(SAAS_NAMES_PREFIX)}${rand(SAAS_NAMES_SUFFIX)} ${['SaaS', 'CRM', 'Platform', 'Tool', 'Pro', 'Hub'].sort(() => 0.5 - Math.random())[0]}`;

// Helper to generate a dummy image URL (placeholder)
const generateImage = (category) => `https://placehold.co/600x400?text=${encodeURIComponent(category)}+SaaS`;

const seedListings = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        const sellers = await User.find({ roles: 'seller' });
        if (sellers.length === 0) {
            console.error('No sellers found! Please create a seller user first.');
            process.exit(1);
        }

        console.log(`Found ${sellers.length} sellers. Distributing listings...`);

        // Clear existing listings
        await Listing.deleteMany({});
        console.log('Cleared existing listings.');

        const listingsToInsert = [];

        // 🎯 30 One-Time SaaS
        for (let i = 0; i < 30; i++) {
            const category = rand(CATEGORIES);
            listingsToInsert.push({
                sellerId: rand(sellers)._id,
                title: generateName(),
                description: rand(DESCRIPTIONS),
                price: rand(ONE_TIME_PRICES),
                currency: 'USD',
                pricingModel: 'one_time',
                category: category,
                status: 'approved',
                visibility: 'public',
                images: [generateImage(category)],
                tags: [category.split(' ')[0], 'SaaS', 'Tool'],
                stats: {
                    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
                    reviewCount: Math.floor(Math.random() * 100),
                    salesCount: Math.floor(Math.random() * 500),
                    likes: Math.floor(Math.random() * 200)
                }
            });
        }

        // 🎯 15 Monthly Subscriptions
        for (let i = 0; i < 15; i++) {
            const category = rand(CATEGORIES);
            listingsToInsert.push({
                sellerId: rand(sellers)._id,
                title: generateName(),
                description: `Monthly Subscription: ${rand(DESCRIPTIONS)}`,
                price: rand(MONTHLY_PRICES),
                currency: 'USD',
                pricingModel: 'subscription_monthly',
                category: category,
                status: 'approved',
                visibility: 'public',
                images: [generateImage(category)],
                tags: [category.split(' ')[0], 'Subscription', 'Monthly'],
                stats: {
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviewCount: Math.floor(Math.random() * 100),
                    salesCount: Math.floor(Math.random() * 300),
                    likes: Math.floor(Math.random() * 150)
                }
            });
        }

        // 🎯 5 Yearly Subscriptions
        for (let i = 0; i < 5; i++) {
            const category = rand(CATEGORIES);
            listingsToInsert.push({
                sellerId: rand(sellers)._id,
                title: generateName(),
                description: `Yearly Plan (Best Value): ${rand(DESCRIPTIONS)}`,
                price: rand(YEARLY_PRICES),
                currency: 'USD',
                pricingModel: 'subscription_yearly',
                category: category,
                status: 'approved',
                visibility: 'public',
                images: [generateImage(category)],
                tags: [category.split(' ')[0], 'Subscription', 'Yearly', 'Enterprise'],
                stats: {
                    rating: (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
                    reviewCount: Math.floor(Math.random() * 50),
                    salesCount: Math.floor(Math.random() * 100),
                    likes: Math.floor(Math.random() * 80)
                }
            });
        }

        await Listing.insertMany(listingsToInsert);
        console.log(`✅ Successfully seeded ${listingsToInsert.length} listings!`);
        console.log('Distribution:');
        console.log('- One-time: 30');
        console.log('- Monthly: 15');
        console.log('- Yearly: 5');

        process.exit();
    } catch (error) {
        console.error('Error seeding listings:', error);
        process.exit(1);
    }
};

seedListings();
