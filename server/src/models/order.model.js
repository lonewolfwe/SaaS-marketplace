const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    type: {
        type: String,
        enum: ['one_time', 'subscription'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled', 'refunded', 'disputed'],
        default: 'pending',
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    payment: {
        transactionId: { type: String },
        provider: { type: String, enum: ['stripe', 'paypal'] },
        status: { type: String }
    },
    subscription: {
        interval: { type: String, enum: ['month', 'year'] },
        startDate: { type: Date },
        nextBillingDate: { type: Date },
        endDate: { type: Date }, // For cancellation effective date
        isActive: { type: Boolean, default: true },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired', 'past_due'],
            default: 'active'
        }
    }
}, { timestamps: true });

// Removed redundant single field indexes

module.exports = mongoose.model('Order', OrderSchema);
