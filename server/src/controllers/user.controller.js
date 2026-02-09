const User = require('../models/user.model');
const Listing = require('../models/listing.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
});

exports.toggleSavedListing = catchAsync(async (req, res, next) => {
    const listingId = req.params.id;
    const userId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) {
        return next(new AppError('Listing not found', 404));
    }

    const user = await User.findById(userId);

    // Check if already saved
    const index = user.savedListings.indexOf(listingId);
    let isSaved = false;

    if (index === -1) {
        // Not saved, so add it
        user.savedListings.push(listingId);
        isSaved = true;
    } else {
        // Already saved, so remove it
        user.savedListings.splice(index, 1);
        isSaved = false;
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            isSaved,
            savedListings: user.savedListings
        }
    });
});

exports.toggleLikedListing = catchAsync(async (req, res, next) => {
    const listingId = req.params.id;
    const userId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) {
        return next(new AppError('Listing not found', 404));
    }

    const user = await User.findById(userId);

    // Check if already liked
    const index = user.likedListings.indexOf(listingId);
    let isLiked = false;

    if (index === -1) {
        // Like
        user.likedListings.push(listingId);
        listing.stats.likes += 1;
        isLiked = true;
    } else {
        // Unlike
        user.likedListings.splice(index, 1);
        listing.stats.likes = Math.max(0, listing.stats.likes - 1);
        isLiked = false;
    }

    await Promise.all([
        user.save({ validateBeforeSave: false }),
        listing.save({ validateBeforeSave: false })
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            isLiked,
            likesCount: listing.stats.likes
        }
    });
});

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const allowedFields = ['firstName', 'lastName', 'email', 'avatarUrl', 'companyName', 'bio']; // Added bio
    const filteredBody = {};
    Object.keys(req.body).forEach(el => {
        if (allowedFields.includes(el)) {
            // Special handling for profile fields if they are sent flat or nested
            // The prompt implies sending flat fields or maybe profile object. 
            // My User model has profile subdoc. 
            // Let's assume frontend sends flattened fields or we map them.
            // Actually, let's look at User Schema if possible, but assuming profile structure:
            // user.profile.firstName
            if (['firstName', 'lastName', 'avatarUrl', 'companyName', 'bio'].includes(el)) {
                if (!filteredBody.profile) filteredBody.profile = {};
                filteredBody.profile[el] = req.body[el];
            } else {
                filteredBody[el] = req.body[el];
            }
        }
    });

    // Check if we need to merge with existing profile to avoid overwriting with empty object if using findByIdAndUpdate
    // Better way: retrieve user, update fields, save.
    const user = await User.findById(req.user.id);

    if (req.body.firstName) user.profile.firstName = req.body.firstName;
    if (req.body.lastName) user.profile.lastName = req.body.lastName;
    if (req.body.bio) user.profile.bio = req.body.bio; // Ensure schema has bio
    if (req.body.companyName) user.profile.companyName = req.body.companyName;
    // avatarUrl handled separately usually, but here:
    if (req.body.avatarUrl) user.profile.avatarUrl = req.body.avatarUrl;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
