const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));
exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
exports.addNewUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
exports.getOneUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
