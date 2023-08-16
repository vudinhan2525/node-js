const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => new AppError(`Invalid ${error.path}: ${error.value}`, 404);
const handleDuplicateFieldDB = (error) =>
    new AppError(`Duplicate field value '${error.keyValue.name}'.Please use another`, 400);
const handleValidationErrorDB = (error) => {
    const message = Object.values(error.errors)
        .map((el) => el.message)
        .join('. ');
    return new AppError(message, 400);
};
const handleJsonWebTokenError = () => new AppError('Invalid token please login again', 401);
const handleJsonWebTokenExpired = () => new AppError('Time in your application is expired, please login again', 401);
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.log('Error: ', err);
        res.status(500).json({
            status: err.status,
            message: 'Something went wrong',
        });
    }
};
module.exports = (err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.create(err);
        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        } else if (error.code === 11000) {
            error = handleDuplicateFieldDB(error);
        } else if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        } else if (error.name === 'JsonWebTokenError') {
            error = handleJsonWebTokenError();
        } else if (error.name === 'TokenExpiredError') {
            error = handleJsonWebTokenExpired();
        }
        sendErrorProd(error, res);
    }
};
