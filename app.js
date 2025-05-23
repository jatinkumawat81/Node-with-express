const express = require('express');
const CustomError = require('./Utils/CustomError');
const globelErrorHandler = require('./Controllers/errorController');
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRouter');

let app = express();

app.use(express.json())


app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', authRouter);

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`,404);
    next(err)
})

app.use(globelErrorHandler)
module.exports = app;