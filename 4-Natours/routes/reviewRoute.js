const express = require('express');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });
router
    .route('/')
    .get(reviewController.getAllReview)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.addTourUserIds,
        reviewController.addNewReview,
    );
router
    .route('/:id')
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview)
    .get(reviewController.getOneReview);
module.exports = router;
