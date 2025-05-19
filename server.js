const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const app = require('./app');

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser: true
}).then((conn)=>{
    console.log('successfull connect DB');
    // create a server
    const port = process.env.PORT || 3000;
    app.listen(port,()=>{
        console.log('server has started');
    })
    
}).catch((err)=>{
    console.log('err');
    
})

