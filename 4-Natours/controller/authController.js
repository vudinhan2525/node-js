// eslint-disable-next-line import/no-extraneous-dependencies
const { promisify } = require('util');
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
        role: req.body.role,
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
    //1) Check if token is exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('Please login !!!'), 401);
    }
    //2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if user still exists
    const currentUser = await User.findOne({ _id: decoded.id });
    if (!currentUser) {
        return next(new AppError('The user belong to this token is no longer exists', 401));
    }
    //4) Check if user changed password
    if (currentUser.verifyPasswordChanged(decoded.iat)) {
        return next(new AppError('User recently changed password, please try again'), 401);
    }
    req.user = currentUser;
    next();
});
exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You don't have permisson to do that", 401));
        }
        next();
    };
