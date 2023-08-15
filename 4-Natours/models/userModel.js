const validator = require('validator');

const mongoose = require('mongoose');

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
    },
    photo: {
        type: String,
    },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
