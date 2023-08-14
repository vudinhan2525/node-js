const express = require('express');
const morgan = require('morgan');
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');

const app = express();
// 1) Middle Ware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`public`));
// 2) Route Handler
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'failed',
        message: `Can't find ${req.originalUrl} in this server!!`,
    });
    next();
});
module.exports = app;
