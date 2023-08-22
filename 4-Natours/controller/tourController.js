const Tour = require('../models/tourModel');
const APIFeature = require('../utils/apiFeature');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.get5TopTours = (req, res, next) => {
    req.query = {
        limit: 5,
        sort: '-ratingAverage,price',
        fields: 'name,price,ratingAverage,summary,difficulty',
    };
    next();
};

exports.getAllTours = catchAsync(async (req, res) => {
    //EXECUTE QUERY
    const features = new APIFeature(Tour.find(), req.query);
    features.filter().sort().fields().pagination();
    const tours = await features.query;
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours,
    });
});
exports.getOneTour = factory.getOne(Tour, { path: 'reviews' });
exports.addNewTour = factory.addNewOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: '$difficulty',
                num: { $sum: 1 },
                numRating: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: {
                avgRating: 1,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        stats: stats,
    });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStart: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        plan,
    });
});
