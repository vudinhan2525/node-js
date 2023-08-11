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

module.exports = app;
