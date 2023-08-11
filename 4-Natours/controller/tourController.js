const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
exports.checkID = (req, res, next, val) => {
    if (req.params.id * 1 >= tours.length) {
        return res.status(404).send('Not found');
    }
    next();
};
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: [...tours],
    });
};
exports.getOneTour = (req, res) => {
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
exports.updateTour = (req, res) => {
    tours[req.params.id] = Object.assign(tours[req.params.id], req.body);
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), () => {
        res.status(201).json({
            status: 'success',
            data: tours[req.params.id],
        });
    });
};
exports.checkPostTour = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'failed',
            message: 'Missing name or price',
        });
    }
    next();
};
exports.addNewTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, ...req.body);
    tours.push(newTour);
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), () => {
        res.status(201).json({
            status: 'success',
            results: tours.length,
            data: newTour,
        });
    });
};
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
