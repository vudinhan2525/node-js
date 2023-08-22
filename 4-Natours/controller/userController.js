const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const FilterObj = (obj, ...Fields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (Fields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: users,
    });
});
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for change password', 400));
    }
    const updatedData = FilterObj(req.body, 'email', 'name');
    const userUpdated = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        data: userUpdated,
    });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(200).json({
        status: 'success',
    });
});
exports.getOneUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
