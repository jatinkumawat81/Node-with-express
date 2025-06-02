const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/CustomError');
const sendEmail = require('../Utils/email');
const User = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const util = require('util');
const crypto = require('crypto');

const signToken = id =>{
    return jwt.sign({id},process.env.SECRET_STR,{
    expiresIn: process.env.LOGIN_EXPIRES
   })
}

const createSendResponse = (user,statusCode,res)=>{
    const token = signToken(user._id);
    const options = {
        maxAge: process.env.LOGIN_EXPIRES,
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    res.cookie('jwt',token,options);
    user.password = undefined;
   res.status(statusCode).json({
    status: 'success',
    token,
    data: {
        user
    }
   })
}

exports.signup = asyncErrorHandler(async (req,res,next) =>{
   const user = await User.create(req.body);

   createSendResponse(user,201,res);
})

exports.login = asyncErrorHandler(async (req,res,next) =>{
    const email = req.body.email;
    const password = req.body.password;
    // const {email, password} = req.body;

    if(!email || !password){
        const error = new CustomError('Please provide email ID & Password for login in!', 400);
        return next(error);
    }

   const user = await User.findOne({ email }).select('+password');
//    const isMatch = await user.comparePasswordInDb(password,user.password);

   if(!user || !(await user.comparePasswordInDb(password,user.password))){
    const error = new CustomError('Incorrect email or password', 400);
    return next(error);
   }

   createSendResponse(user,200,res);
});

const verifyToken = util.promisify(jwt.verify);
exports.protect = asyncErrorHandler(async (req,res,next) => {
    const testToken = req.headers.authorization;
    let token;
    if(testToken &&  testToken.startsWith('Bearer')){
        token = testToken.split(' ')[1]
    }

    if(!token){
        next(new CustomError('You are not logged in!', 401));
    }
    const decodedToken = await verifyToken(token, process.env.SECRET_STR);
    
    const user = await User.findById(decodedToken.id);
    if(!user){
        const err = new CustomError('The user with the given token does not exist.',401)
        next(err)
    }

    if(await user.isPasswordChanged(decodedToken.iat)){
        return next(new CustomError('The Password has been changed recently. Please login again.', 401))
    }
    req.user = user;
    next();
});

exports.restrict = (role) => {
    return (req,res,next) => {
        if(role !== req.user.role){
            const error = new CustomError('You do not have permission to perform this action', 403);
            next(error);
        }
        next();
    }
}

// exports.restrict = (...role) => {
//     return (req,res,next) => {
//         if(!role.includes(req.user.role)){
//             const error = new CustomError('You do not have permission to perform this action', 403);
//             next(error);
//         }
//         next();
//     }
// }

exports.forgotPassword = asyncErrorHandler(async (req,res,next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        const error = new CustomError('We could not find the user with given email.',404);
        next(error);
    }

    const resetToken = user.createResetPassToken();
    await user.save({validateBeforeSave: false});

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetURL}\n\nThis reset password link will be valid only for 10 minutes.`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Password request received',
            message: message,
        });
        res.status(200).json({
            status: 'success',
            message: 'Password reset link send to the user email.'
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.PasswordResetToeknExpires = undefined;
        user.save({validateBeforeSave: false});
        return next(new CustomError('There was an error sending password reset email. Please try again later.', 500))
    }
})

exports.resetPassword = asyncErrorHandler(async(req,res,next) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: token, PasswordResetToeknExpires: {$gt: Date.now()}});

    if(!user){
        const error = new CustomError('Token is invalid or has expired!', 400);
        next(error);
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.PasswordResetToeknExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    createSendResponse(user,200,res);
});

