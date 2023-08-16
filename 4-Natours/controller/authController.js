// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    const token = signToken(newUser._id);
    res.status(200).json({
        status: 'success',
        token,
        data: newUser,
    });
});
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    //Check email & password in db
    const user = await User.findOne({ email: email }).select('password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Email or password is incorrect!'), 401);
    }
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
});
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('Please login !!!'), 401);
    }
    next();
});
