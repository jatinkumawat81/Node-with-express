const express = require('express');
let app = express();
const CustomError = require('./Utils/CustomError');
const globelErrorHandler = require('./Controllers/errorController');


app.use(express.json())


const moviesRouter = require('./Routes/moviesRoutes')
app.use('/api/v1/movies', moviesRouter);


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