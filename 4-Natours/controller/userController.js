const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: users,
    });
});
exports.addNewUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
exports.getOneUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
