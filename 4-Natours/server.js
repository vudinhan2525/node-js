const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    process.exit(1);
});
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB);

const obj = require('./dev-data/data/import-dev-data');

if (process.argv[2] === '--import') {
    obj.importData();
} else if (process.argv[2] === '--delete') {
    obj.deleteData();
}

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port} ... `);
});
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
