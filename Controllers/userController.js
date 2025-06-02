const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/CustomError');
const sendEmail = require('../Utils/email');
const User = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const util = require('util');
const crypto = require('crypto');
const authController = require('./authController');


const filterReqObj = (obj,...allowedFeilds)=>{
    const newObj = {};
    Object.keys(obj).forEach(prop => {
        if(allowedFeilds.includes(prop)){
            newObj[prop] = obj[prop];
        }
    })
    return newObj;
}

exports.getAllUser = asyncErrorHandler(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
            users
        }
    })
})


exports.updatePassword = asyncErrorHandler(async(req,res,next)=>{
    //GET current user data from database
    const user = await User.findById(req.user._id).select('+password');

    //check if the supplied current password is correct
    if(!(await user.comparePasswordInDb(req.body.currentPassword,user.password))){
        return next(new CustomError('The current password you provided is wrong', 401));
    }

    //if supplied password is correct, update user password with new value
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    //login user & send JWT

    authController.createSendResponse(user,200,res);
});

exports.updateMe = asyncErrorHandler(async(req,res,next)=>{
    if(req.body.password || req.body.confirmPassword){
        return next(new CustomError('You can not update your password using this endpoint.', 400));
    }

    const filterObj = filterReqObj(req.body,'name','email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filterObj,{runValidators: true, new: true});
    await updatedUser.save(); 
    authController.createSendResponse(updatedUser,200,res);
});

exports.deleteMe = asyncErrorHandler(async(req,res,next)=>{
    await User.findByIdAndUpdate(req,user.id,{active: false});

    res.status(204).json({
        status: 'success',
        data: null
    })
})