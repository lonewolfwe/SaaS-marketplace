const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * Bootstraps the default admin account if it doesn't exist.
 * This should be called on server startup.
 */
const bootstrapAdmin = async () => {
    try {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.warn('[Bootstrap] Admin credentials not found in environment variables. Skipping admin creation.');
            return;
        }

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`[Bootstrap] Admin account (${adminEmail}) already exists.`);
            return;
        }

        const passwordHash = await bcrypt.hash(adminPassword, 12);

        await User.create({
            email: adminEmail,
            passwordHash: passwordHash,
            roles: ['admin'],
            profile: {
                firstName: 'System',
                lastName: 'Admin',
                companyName: 'SaaS Marketplace'
            },
            status: 'active',
            verification: {
                isVerified: true,
                verifiedAt: new Date()
            }
        });

        console.log(`[Bootstrap] Default admin created: ${adminEmail}`);

    } catch (error) {
        console.error('[Bootstrap] Failed to bootstrap admin:', error);
    }
};

module.exports = bootstrapAdmin;
