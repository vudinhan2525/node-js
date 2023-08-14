const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();
router.route('/tours-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/top-5-tours').get(tourController.get5TopTours, tourController.getAllTours);
router.route('/').get(tourController.getAllTours).post(tourController.addNewTour);
router.route('/:id').get(tourController.getOneTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
