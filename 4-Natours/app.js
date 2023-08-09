const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'));
// 1) Middle Ware
app.use(morgan('dev'));
app.use(express.json());

// 2) Route Handler
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: [...tours],
    });
};
const getOneTour = (req, res) => {
    const tour = tours.find((el) => el.id === req.params.id * 1);
    if (tour === undefined) {
        res.status(404).send('Not found');
        return;
    }
    res.status(200).json({
        status: 'success',
        data: tour,
    });
};
const updateTour = (req, res) => {
    if (req.params.id * 1 >= tours.length) {
        return res.status(404).send('Not found');
    }
    tours[req.params.id] = Object.assign(tours[req.params.id], req.body);
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: tours[req.params.id],
        });
    });
};
const addNewTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            results: tours.length,
            data: newTour,
        });
    });
};
const deleteTour = (req, res) => {
    if (req.params.id * 1 >= tours.length) {
        return res.status(404).send('Not found');
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
const addNewUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
const getOneUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Failed',
    });
};
app.route('/api/v1/tours').get(getAllTours).post(addNewTour);
app.route('/api/v1/tours/:id').get(getOneTour).patch(updateTour).delete(deleteTour);
app.route('/api/v1/users').get(getAllUsers).post(addNewUser);
app.route('/api/v1/users/:id').get(getOneUser).patch(updateUser).delete(deleteUser);

app.listen(8000, () => {
    console.log('App running on port 8000 ... ');
});
