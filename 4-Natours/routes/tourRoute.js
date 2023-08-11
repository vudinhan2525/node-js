const express = require('express');
const tourController = require('../controller/tourController');
const router = express.Router();
router.param('id', tourController.checkID);
router.route('/').get(tourController.getAllTours).post(tourController.checkPostTour, tourController.addNewTour);
router.route('/:id').get(tourController.getOneTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
