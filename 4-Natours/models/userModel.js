const crypto = require('crypto');
const validator = require('validator');

const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, 'User must have a email'],
        validate: {
            validator: validator.isEmail,
            message: 'Email is invalid',
        },
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide', 'lead-guide'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'User must have a confirm password'],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Password confirm not true',
        },
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangeAt: Date,
    photo: {
        type: String,
    },
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangeAt = Date.now() - 3000;
    next();
});
userSchema.methods.correctPassword = async function (duplicatePassword, password) {
    return await bcrypt.compare(duplicatePassword, password);
};
userSchema.methods.verifyPasswordChanged = function (JWTTimeCreate) {
    if (this.passwordChangeAt) {
        const time = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        return JWTTimeCreate < time;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({ resetToken }, this.passwordResetToken);
    return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
