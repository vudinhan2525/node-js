const multer = require('multer');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const uploadStorage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        cb(new AppError('Please provide image file !!!', 404), false);
    } else {
        cb(null, true);
    }
};
const upload = multer({ storage: uploadStorage, fileFilter: fileFilter });
exports.upLoad = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
]);
exports.resizeTourImage = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    req.body.images = [];
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);
    const imagePromise = req.files.images.map(async (el, index) => {
        const fileName = `tour-${req.params.id}-${Date.now()}-${
            index + 1
        }.jpeg`;
        await sharp(el.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${fileName}`);
        req.body.images.push(fileName);
    });
    await Promise.all(imagePromise);
    next();
});
exports.get5TopTours = (req, res, next) => {
    req.query = {
        limit: 5,
        sort: '-ratingAverage,price',
        fields: 'name,price,ratingAverage,summary,difficulty',
    };
    next();
};

exports.getAllTours = factory.getAll(Tour);
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
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
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
exports.getTourWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    let radius = 0;
    if (unit === 'mi') {
        radius = distance / 3963.2;
    } else if (unit === 'km') {
        radius = distance / 6371;
    }
    if (!lat || !lng) {
        return next(new AppError('Please provide your position!!', 400));
    }
    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
        status: 'success',
        length: tours.length,
        data: tours,
    });
});
exports.getTourDistance = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    let multiply = 1;
    if (unit === 'mi') multiply = 0.00062;
    if (unit === 'km') multiply = 0.001;
    if (!lat || !lng) {
        return next(new AppError('Please provide your position!!', 400));
    }
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: multiply,
            },
        },
        {
            $project: {
                name: 1,
                distance: 1,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: distances,
    });
});
