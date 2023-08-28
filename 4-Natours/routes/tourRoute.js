const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
router.route('/tours-stats').get(tourController.getTourStats);
router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan,
    );
router
    .route('/top-5-tours')
    .get(tourController.get5TopTours, tourController.getAllTours);
router.get(
    '/tours-within/:distance/unit/:unit/position/:latlng',
    tourController.getTourWithin,
);
router.get('/distances/:latlng/unit/:unit', tourController.getTourDistance);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.addNewTour,
    );
router
    .route('/:id')
    .get(tourController.getOneTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.upLoad,
        tourController.resizeTourImage,
        tourController.updateTour,
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour,
    );
module.exports = router;
