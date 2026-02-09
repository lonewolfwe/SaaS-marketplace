const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const env = require('../config/env');

const signToken = id => {
    return jwt.sign({ id }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + 15 * 60 * 1000 // 15 mins (simple conversion from string if needed, but assuming manual set for now or parsing)
            // Actually env.JWT_EXPIRES_IN is '15m', let's stick to using that for token, and standard time for cookie if we use it
        ),
        httpOnly: true
    };

    // Note: We are sending token in body for this architecture as requested (Stateless JWT), but cookies are also an option.
    user.passwordHash = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.register = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;

    // Basic manual validation (Joi should be used in middleware, but fail-safe here)
    if (!email || !password || !firstName || !lastName) {
        return next(new AppError('Please provide all required fields', 400));
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email already in use', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Allow role selection for demo/MVP purposes, but restricted in real prod normally
    const useRole = role && ['buyer', 'seller'].includes(role) ? role : 'buyer';

    const newUser = await User.create({
        profile: { firstName, lastName },
        email,
        passwordHash: hashedPassword,
        roles: [useRole]
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});
