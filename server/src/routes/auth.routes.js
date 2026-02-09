const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protect all routes after this middleware
router.use(authMiddleware.protect);

router.get('/me', authController.getMe);

module.exports = router;
