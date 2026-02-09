const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

router.get('/me', userController.getMe);
router.patch('/update-profile', userController.updateProfile);
router.post('/saved/:id', userController.toggleSavedListing);
router.post('/liked/:id', userController.toggleLikedListing);

router.get('/', authMiddleware.restrictTo('admin'), userController.getAllUsers);

module.exports = router;
