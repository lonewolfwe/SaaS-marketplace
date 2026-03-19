const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    registrationsOpen: {
        type: Boolean,
        default: true
    },
    fees: {
        standard: {
            type: Number,
            default: 5.0
        },
        enterprise: {
            type: Number,
            default: 2.5
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Singleton pattern: Ensure only one settings document exists
platformSettingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

const PlatformSettings = mongoose.model('PlatformSettings', platformSettingsSchema);

module.exports = PlatformSettings;
