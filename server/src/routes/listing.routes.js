const express = require('express');
const listingController = require('../controllers/listing.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/trending', listingController.getTrendingListings);
router.get('/new-hot', listingController.getNewAndHotListings);
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListing);

// Protected Routes
router.use(authMiddleware.protect);

router.get('/my-listings', authMiddleware.restrictTo('seller', 'admin'), listingController.getMyListings);

router
    .route('/')
    .post(authMiddleware.restrictTo('seller', 'admin'), listingController.createListing);

router
    .route('/:id')
    .patch(authMiddleware.restrictTo('seller', 'admin'), listingController.updateListing)
    .delete(authMiddleware.restrictTo('seller', 'admin'), listingController.deleteListing);

module.exports = router;
