const express = require('express');
const router = express.Router();
const authController = require('./../Controllers/authController');


router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/updatePassword').patch(authController.protect,authController.updatePassword);

module.exports = router;