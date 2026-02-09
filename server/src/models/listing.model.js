const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        index: 'text'
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    images: [{
        type: String,
        required: true
    }],
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected', 'paused'],
        default: 'draft',
        index: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public'
    },
    pricingModel: {
        type: String,
        enum: ['one_time', 'subscription_monthly', 'subscription_yearly'],
        default: 'one_time'
    },
    stats: {
        rating: { type: Number, default: 0, index: true },
        reviewCount: { type: Number, default: 0 },
        salesCount: { type: Number, default: 0 },
        likes: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Retaining compound indexes
ListingSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Listing', ListingSchema);
