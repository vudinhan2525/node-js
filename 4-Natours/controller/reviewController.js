const Review = require('../models/reviewModel');
const APIFeature = require('../utils/apiFeature');
//const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReview = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeature(Review.find(filter), req.query);
    features.filter().sort().fields().pagination();
    const reviews = await features.query;
    res.status(200).json({
        status: 'success',
        length: reviews.length,
        data: reviews,
    });
});
exports.addTourUserIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.tour) req.body.tour = req.params.tourId;
    next();
};
exports.addNewReview = factory.addNewOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
