const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();
router.get('/', authController.isLogedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLogedIn, viewController.getTour);
router.get('/login', authController.isLogedIn, viewController.getLoginModal);
router.get('/me', authController.protect, viewController.getUserAccount);
router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData,
);
module.exports = router;
