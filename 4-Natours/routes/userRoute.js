const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getOneUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
