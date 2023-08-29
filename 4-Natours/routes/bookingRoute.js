const express = require('express');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');

const router = express.Router();
router.get(
    '/checkout-sessions/:tourId',
    authController.protect,
    bookingController.getBookingSessions,
);
module.exports = router;
