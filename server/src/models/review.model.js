const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
        index: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 1000
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

ReviewSchema.index({ listingId: 1 });
ReviewSchema.index({ sellerId: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
