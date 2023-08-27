const path = require('path');
const express = require('express');
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSanitize = require('express-mongo-sanitize');
// eslint-disable-next-line import/no-extraneous-dependencies
const hpp = require('hpp');
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');
const viewRoute = require('./routes/viewRoute');
const reviewRoute = require('./routes/reviewRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) Middle Ware
const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org'];
const styleSrcUrls = [
    'https://unpkg.com/',
    'https://tile.openstreetmap.org',
    'https://fonts.googleapis.com/',
    'https://cdnjs.cloudflare.com',
];
const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

//set security http headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", 'blob:'],
            objectSrc: [],
            imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }),
);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
const limiter = rateLimit({
    max: 50,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!!',
});
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
app.use(express.static(path.join(__dirname, 'public')));
// 2) Route Handler
app.use('/', viewRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} in this server!!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
