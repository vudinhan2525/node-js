const multer = require('multer');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const uploadStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });
const uploadStorage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        cb(new AppError('Please provide image file !!!', 404), false);
    } else {
        cb(null, true);
    }
};
const upload = multer({ storage: uploadStorage, fileFilter: fileFilter });
exports.upLoad = upload.single('photo');

const FilterObj = (obj, ...Fields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (Fields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});
exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for change password', 400));
    }
    const updatedData = FilterObj(req.body, 'email', 'name');
    if (req.file) {
        updatedData.photo = req.file.filename;
    }
    const userUpdated = await User.findByIdAndUpdate(req.user.id, updatedData, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: userUpdated,
    });
});
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.getAllUsers = factory.getAll(User);
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(200).json({
        status: 'success',
    });
});
exports.getOneUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
