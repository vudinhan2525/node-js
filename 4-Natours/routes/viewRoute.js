const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');

const router = express.Router();
router.get(
    '/',
    bookingController.getBookingCheckout,
    authController.isLogedIn,
    viewController.getOverview,
);
router.get('/tour/:slug', authController.isLogedIn, viewController.getTour);
router.get('/login', authController.isLogedIn, viewController.getLoginModal);
router.get('/me', authController.protect, viewController.getUserAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData,
);
module.exports = router;
