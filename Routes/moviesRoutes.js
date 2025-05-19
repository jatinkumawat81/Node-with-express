const express = require("express");
const moviesController = require('./../Controllers/moviesController')
const router = express.Router();

// router.param('id',(req,res,next,value)=>{
    
// })
router.route('/highest-rated').get(moviesController.getHighestRated,moviesController.getAllMovies);
router.route('/movie-stats').get(moviesController.getMoviesStats);
router.route('/movie-by-genre/:genre').get(moviesController.getMovieByGenre);

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)
module.exports = router