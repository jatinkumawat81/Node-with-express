const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const CustomError = require('./Utils/CustomError');
const globelErrorHandler = require('./Controllers/errorController');
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter')
const sanitize = require('express-mongo-sanitize');

let app = express();
app.use(helmet())
let limmiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'We have received too many request from thi IP. Please try after one hour.'
});
app.use('/api',limmiter)
app.use(express.json({
    limit: '10kb'
}));
app.use(sanitize())


app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

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