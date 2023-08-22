const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeature = require('../utils/apiFeature');

exports.getAll = (Model) =>
    catchAsync(async (req, res) => {
        //Just for reviewController
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        //Common
        const features = new APIFeature(Model.find(filter), req.query);
        features.filter().sort().fields().pagination();
        const doc = await features.query;
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc,
        });
    });
exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError(`Can't find with this id`, 404));
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError(`Can't find this id`, 404));
        }
        res.status(200).json({
            status: 'success',
            data: doc,
        });
    });
exports.addNewOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const newDoc = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: newDoc,
        });
    });
exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findOne({ _id: req.params.id });
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;
        if (!doc) {
            return next(new AppError(`Can't find this id`, 404));
        }
        res.status(200).json({
            status: 'success',
            data: doc,
        });
    });
