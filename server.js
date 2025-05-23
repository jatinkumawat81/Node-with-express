const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const app = require('./app');

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser: true
}).then((conn)=>{
    console.log('successfull connect DB');
}).catch((err)=>{
    console.log('err Db', err);    
})

// create a server
const port = process.env.PORT || 3000;
const server = app.listen(port,()=>{
    console.log('server has started');
});

process.on('unhandledRejection', (err)=>{
    console.log('Unhandled rejection occured! Shutting down...');
    server.close(()=>{
        process.exit(1);
    });
})
process.on('uncaughtException', (err)=>{
    console.log('Uncaught Exception occured! Shutting down...');
    server.close(()=>{
        process.exit(1);
    });
})
