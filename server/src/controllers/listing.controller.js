const Listing = require('../models/listing.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getTrendingListings = catchAsync(async (req, res, next) => {
    const listings = await Listing.find({ status: 'approved', visibility: 'public' })
        .sort('-stats.salesCount -stats.likes')
        .limit(6)
        .populate('sellerId', 'profile.firstName profile.lastName profile.avatarUrl profile.companyName');

    res.status(200).json({
        status: 'success',
        results: listings.length,
        data: { listings }
    });
});

exports.getNewAndHotListings = catchAsync(async (req, res, next) => {
    // For now "Hot" just means newest, or we could mix it up. 
    // Let's just return newest for now.
    const listings = await Listing.find({ status: 'approved', visibility: 'public' })
        .sort('-createdAt')
        .limit(6)
        .populate('sellerId', 'profile.firstName profile.lastName profile.avatarUrl profile.companyName');

    res.status(200).json({
        status: 'success',
        results: listings.length,
        data: { listings }
    });
});

exports.getAllListings = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    // Basic filtering for public: only approved listings, UNLESS overridden by status query (useful for admin/debugging)
    let filter = {};
    if (req.query.status) {
        filter.status = req.query.status;
    } else {
        filter.status = 'approved';
    }

    if (req.query.search) {
        filter.$text = { $search: req.query.search };
    }

    // Create a copy of query params for APIFeatures
    // We only need to remove 'search' because it's handled above via $text query
    // APIFeatures calculates pagination/sorting/limiting from the query params, so we must keep them!
    const queryObj = { ...req.query };
    if (queryObj.search) delete queryObj.search;

    const features = new APIFeatures(Listing.find(filter), queryObj)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // Populate seller info
    features.query = features.query.populate('sellerId', 'profile.firstName profile.lastName profile.avatarUrl profile.companyName');

    const listings = await features.query;

    res.status(200).json({
        status: 'success',
        results: listings.length,
        data: {
            listings
        }
    });
});

exports.getMyListings = catchAsync(async (req, res, next) => {
    // Return ALL listings for this seller (draft, pending, approved, etc.)
    const listings = await Listing.find({ sellerId: req.user.id })
        .sort('-createdAt'); // Newest first

    res.status(200).json({
        status: 'success',
        results: listings.length,
        data: {
            listings
        }
    });
});

exports.getListing = catchAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id).populate('sellerId', 'profile.firstName profile.lastName profile.avatarUrl profile.companyName stats');

    if (!listing) {
        return next(new AppError('No listing found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            listing
        }
    });
});

exports.createListing = catchAsync(async (req, res, next) => {
    // Force sellerId to be current user
    if (!req.body.sellerId) req.body.sellerId = req.user.id;

    console.log("Creating listing with payload:", JSON.stringify(req.body, null, 2));

    const newListing = await Listing.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            listing: newListing
        }
    });
});

exports.updateListing = catchAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(new AppError('No listing found with that ID', 404));
    }

    // Check if user is the owner (or admin)
    if (listing.sellerId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    // Prevent updating restricted fields directly via this route (e.g. status to 'approved')
    // Ideally use a separate moderator route for approval, seller can only revert to 'pending' or 'draft'
    if (req.body.status && req.body.status === 'approved' && !req.user.roles.includes('admin')) {
        return next(new AppError('Sellers cannot manually approve listings', 403));
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            listing: updatedListing
        }
    });
});

// Seller deleting their own listing
exports.deleteListing = catchAsync(async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(new AppError('No listing found with that ID', 404));
    }

    if (listing.sellerId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});
