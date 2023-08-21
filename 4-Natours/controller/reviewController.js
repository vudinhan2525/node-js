const Review = require('../models/reviewModel');
const APIFeature = require('../utils/apiFeature');
//const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReview = catchAsync(async (req, res, next) => {
    const features = new APIFeature(Review.find(), req.query);
    features.filter().sort().fields().pagination();
    const reviews = await features.query;
    res.status(200).json({
        status: 'success',
        length: reviews.length,
        data: reviews,
    });
});
exports.addNewReview = catchAsync(async (req, res, next) => {
    const review = await Review.create(req.body);
    res.status(200).json({
        status: 'success',
        data: review,
    });
});
