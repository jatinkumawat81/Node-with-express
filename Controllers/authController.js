const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const User = require('./../Models/userModel');

exports.signup = asyncErrorHandler(async (req,res,next) =>{
   const user = await User.create(req.body);
   res.status(201).json({
    status: 'success',
    data: {
        user
    }
   })
})