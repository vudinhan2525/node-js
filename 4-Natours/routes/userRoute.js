const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getOneUser);

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getOneUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
