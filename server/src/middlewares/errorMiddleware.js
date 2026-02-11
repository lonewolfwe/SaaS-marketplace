const env = require('../config/env');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        // Programming or other unknown error: don't leak details
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        // Cloning error object to copy properties
        let error = { ...err };
        error.message = err.message;

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            error = { ...error, message: `Invalid ${err.path}: ${err.value}`, statusCode: 400, status: 'fail', isOperational: true };
        }
        // Mongoose duplicate key
        if (err.code === 11000) {
            const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
            error = { ...error, message: `Duplicate field value: ${value}. Please use another value!`, statusCode: 400, status: 'fail', isOperational: true };
        }
        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            error = { ...error, message: `Invalid input data. ${errors.join('. ')}`, statusCode: 400, status: 'fail', isOperational: true };
        }
        // JWT errors
        if (err.name === 'JsonWebTokenError') {
            error = { ...error, message: 'Invalid token. Please log in again!', statusCode: 401, status: 'fail', isOperational: true };
        }
        if (err.name === 'TokenExpiredError') {
            error = { ...error, message: 'Your token has expired! Please log in again.', statusCode: 401, status: 'fail', isOperational: true };
        }

        sendErrorProd(error, res);
    }
};
