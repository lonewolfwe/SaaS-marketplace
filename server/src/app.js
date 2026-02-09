const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const hpp = require('hpp');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');

const app = express();

// Security Middleware
app.use(helmet());
const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:5173', 'https://saas-marketplace-xq1j.onrender.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked CORS origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 'fail',
        message: 'Too many requests from this IP, please try again later'
    }
});
app.use('/api', limiter);

// Structured Logging
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body Parsing
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Compression
app.use(compression());

// Routes
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const listingRouter = require('./routes/listing.routes');
const orderRouter = require('./routes/order.routes');
const globalErrorHandler = require('./middlewares/errorMiddleware');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/listings', listingRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/subscriptions', require('./routes/subscription.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'SaaS Marketplace API Running' });
});

// Handle undefined routes
// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
