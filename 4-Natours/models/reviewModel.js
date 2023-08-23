const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.statics.calcAverageRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, { ratingAverage: stats[0].avgRating, ratingsQuantity: stats[0].nRating });
    } else {
        await Tour.findByIdAndUpdate(tourId, { ratingAverage: 4.5, ratingsQuantity: 0 });
    }
};
reviewSchema.post('save', (doc) => {
    doc.constructor.calcAverageRating(doc.tour);
});
reviewSchema.post(/^findOneAnd/, (doc) => {
    doc.constructor.calcAverageRating(doc.tour);
});
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });
    next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
