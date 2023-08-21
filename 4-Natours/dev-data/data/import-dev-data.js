const fs = require('fs');
const Tour = require('../../models/tourModel');

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json', 'utf-8'));
exports.importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Import DB Success');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

exports.deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Delete DB Success');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};
