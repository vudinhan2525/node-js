const express = require('express');
const tourController = require('../controller/tourController');
const router = express.Router();

router.route('/').get(tourController.getAllTours).post(tourController.addNewTour);
router.route('/:id').get(tourController.getOneTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
