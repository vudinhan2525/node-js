const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);
router.route('/').get(userController.getAllUsers).post(userController.addNewUser);
router.route('/:id').get(userController.getOneUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
