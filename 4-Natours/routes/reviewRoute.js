const express = require('express');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
    .route('/')
    .get(reviewController.getAllReview)
    .post(authController.restrictTo('user'), reviewController.addTourUserIds, reviewController.addNewReview);
router
    .route('/:id')
    .delete(reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .get(authController.restrictTo('user', 'admin'), reviewController.getOneReview);
module.exports = router;
