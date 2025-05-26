const CustomError = require('./../Utils/CustomError');
const devError = (res,error) => {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
            stackTrace: error.stack,
            error: error
        });
}
const prodError = (res,error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        });
    }else{
        res.status(500).json({
            staus: 'error',
            message: 'Something went wrong! Please try again later.'
        })
    }
}

const castErrorHandler = (err) => {
    const msg = `Invalid Value ${err.value} for feild ${err.path}!`;
    return new CustomError(msg,400);
}

const duplicateKeyErrorHandler = (err) => {
    const name = err.keyValue.name;
    const msg = `There is already a movie with name ${name}. Please use another name!`;
    return new CustomError(msg,400)
}

const handleExpiredJWT = (err) => {
    return new CustomError('JWT has expired. Please login again!',401);
}

const handleJWTError = (err) => {
    return new CustomError('Invalid token. Please login again!',401);
}

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        devError(res,error);
    }else if(process.env.NODE_ENV === 'production'){
        // let err = {...error};
        if(error.name === 'CastError')error = castErrorHandler(error);
        if(error.code === 1100)error = duplicateKeyErrorHandler(error);
        if(error.name === 'TokenExpiredError') error = handleExpiredJWT(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
        prodError(res,error)
    }
}