const Tour = require('../models/tourModel');
const APIFeature = require('../utils/apiFeature');

exports.get5TopTours = (req, res, next) => {
    req.query = {
        limit: 5,
        sort: '-ratingAverage,price',
        fields: 'name,price,ratingAverage,summary,difficulty',
    };
    next();
};
exports.getAllTours = async (req, res) => {
    try {
        //EXECUTE QUERY
        const features = new APIFeature(Tour.find(), req.query);
        features.filter().sort().fields().pagination();
        const tours = await features.query;
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: tours,
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error,
        });
    }
};
exports.getOneTour = async (req, res) => {
    try {
        const tour = await Tour.findOne({ _id: req.params.id });
        res.status(200).json({
            status: 'success',
            data: tour,
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error,
        });
    }
};
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: tour,
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error,
        });
    }
};
exports.addNewTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: newTour,
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
};
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
};
exports.getTourStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
};
exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error,
        });
    }
};
