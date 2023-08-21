const Tour = require('../models/tourModel');
const APIFeature = require('../utils/apiFeature');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
exports.getOneTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ _id: req.params.id }).populate('reviews');
    if (!tour) {
        return next(new AppError(`Can't find this id`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: tour,
    });
});
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        return next(new AppError(`Can't find this id`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: tour,
    });
});

exports.addNewTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: newTour,
    });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError(`Can't find this id`, 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
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
