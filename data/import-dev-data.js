const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({path: './config.env'})
const Movie = require('./../Models/movieModel')
mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser: true
}).then((conn)=>{
    console.log('successfull connect DB');
}).catch((err)=>{
    console.log('err');
    
})

const movies = JSON.parse(fs.readFileSync('./data/movies.json','utf-8'));

const deleteMovies = async () => {
    try {
        await Movie.deleteMany();
        console.log('deleted movies')
    } catch (error) {
        console.log(error.message)
    }
    process.exit();
}


const importMovies = async () => {
    try {
        await Movie.create(movies);
        console.log('Imported all movies')
    } catch (error) {
        console.log(error.message)
    }
    process.exit();
} 
if(process.argv[2] == '--import'){
    importMovies();
}
if(process.argv[2] == '--delete'){
    deleteMovies();
}