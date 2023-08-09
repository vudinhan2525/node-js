const express = require('express');
const userController = require('../controller/userController.js');
const router = express.Router();
router.route('/').get(userController.getAllUsers).post(userController.addNewUser);
router.route('/:id').get(userController.getOneUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
