const fs = require('fs');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

const tours = JSON.parse(
    fs.readFileSync('./dev-data/data/tours.json', 'utf-8'),
);
const users = JSON.parse(
    fs.readFileSync('./dev-data/data/users.json', 'utf-8'),
);
const reviews = JSON.parse(
    fs.readFileSync('./dev-data/data/reviews.json', 'utf-8'),
);

exports.importData = async () => {
    try {
        await Promise.all([
            Tour.create(tours),
            User.create(users, { validateBeforeSave: false }),
            Review.create(reviews),
        ]);
        console.log('Import DB Success');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

exports.deleteData = async () => {
    try {
        await Promise.all([
            Tour.deleteMany(),
            User.deleteMany(),
            Review.deleteMany(),
        ]);
        console.log('Delete DB Success');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};
