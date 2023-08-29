// eslint-disable-next-line import/no-extraneous-dependencies
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: user,
    });
};
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    });
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 201, req, res);
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
    createSendToken(user, 200, req, res);
});
exports.logout = (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
    });
};
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    //1) Check if token is exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError('Please login !!!'), 401);
    }
    //2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if user still exists
    const currentUser = await User.findOne({ _id: decoded.id });
    if (!currentUser) {
        return next(
            new AppError(
                'The user belong to this token is no longer exists',
                401,
            ),
        );
    }
    //4) Check if user changed password
    if (currentUser.verifyPasswordChanged(decoded.iat)) {
        return next(
            new AppError('User recently changed password, please try again'),
            401,
        );
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});
exports.isLogedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            //2) Verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET,
            );

            //3) Check if user still exists
            const currentUser = await User.findOne({ _id: decoded.id });
            if (!currentUser) {
                return next();
            }
            //4) Check if user changed password
            if (currentUser.verifyPasswordChanged(decoded.iat)) {
                return next();
            }
            res.locals.user = currentUser;
            return next();
        } catch (error) {
            return next();
        }
    }
    next();
};
exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError("You don't have permisson to do that", 401),
            );
        }
        next();
    };
exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) Get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with this email', 400));
    }
    //2) Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/users/resetPassword/${resetToken}`;
    try {
        await new Email(user, resetURL).sendResetPassword();
        res.status(200).json({
            status: 'success',
            message: 'Token has been sended to user email',
        });
    } catch (error) {
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                `There was an error sending the email. Try again later!`,
                500,
            ),
        );
    }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) Get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    //2) Check and set new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired!!', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    //3) Update passwordchangeat property for user
    await user.save();
    //4) Send back token for user
    createSendToken(user, 200, req, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
    //1) Get user from collection
    const user = await User.findOne({ _id: req.user.id }).select('+password');
    //2) Check if posted password is correct
    if (!(await user.correctPassword(req.body.password, user.password))) {
        return next(new AppError(`Password is not correct`, 401));
    }
    //3) Update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();
    //4) Send back token for user
    createSendToken(user, 200, req, res);
});
