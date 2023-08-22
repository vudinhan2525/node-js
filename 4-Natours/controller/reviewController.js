const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReview = factory.getAll(Review);
exports.getOneReview = factory.getOne(Review);
exports.addTourUserIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.tour) req.body.tour = req.params.tourId;
    next();
};
exports.addNewReview = factory.addNewOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
