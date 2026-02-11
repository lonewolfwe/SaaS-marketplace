const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    roles: {
        type: [String],
        enum: ['buyer', 'seller', 'admin'],
        default: ['buyer'],
        index: true
    },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        avatarUrl: { type: String },
        bio: { type: String }, // For sellers
        companyName: { type: String }, // For sellers
        website: { type: String } // For sellers
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'banned', 'pending_verification'],
        default: 'active',
        index: true
    },
    settings: {
        notifications: { type: Boolean, default: true },
        currency: { type: String, default: 'USD' }
    },
    verification: {
        isVerified: { type: Boolean, default: false },
        documents: [{ type: String }],
        verifiedAt: { type: Date }
    },
    savedListings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }],
    likedListings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }]
}, { timestamps: true });


// Removed redundant single field indexes that already have index: true in schema definition

module.exports = mongoose.model('User', UserSchema);
