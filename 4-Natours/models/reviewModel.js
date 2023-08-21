const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty'],
        },
        rating: {
            type: Number,
            min: [0, 'Rating must be above or equal to 0'],
            max: [5, 'Rating must be below or equal to 5'],
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must be belong to a tour'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must be belong to a user'],
        },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
);
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });
    next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
