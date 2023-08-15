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
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8,
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
const User = mongoose.model('User', userSchema);
module.exports = User;
