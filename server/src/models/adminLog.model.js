const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    targetType: {
        type: String,
        enum: ['User', 'Listing', 'Order', 'Review'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['approve', 'reject', 'suspend', 'ban', 'refund', 'delete']
    },
    reason: {
        type: String,
        required: true
    },
    metadata: {
        type: Map,
        of: String
    }
}, { timestamps: true });

// Retaining compound index
AdminLogSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model('AdminLog', AdminLogSchema);
