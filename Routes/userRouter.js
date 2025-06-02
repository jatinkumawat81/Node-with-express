const express = require('express');
const router = express.Router();
const userController = require('./../Controllers/userController');
const authController = require('./../Controllers/authController');

router.route('/getAllUsers').patch(userController.getAllUser);
router.route('/updatePassword').patch(authController.protect,userController.updatePassword);
router.route('/updateMe').patch(authController.protect,userController.updateMe);
router.route('/deleteMe').patch(authController.protect,userController.deleteMe);

module.exports = router;