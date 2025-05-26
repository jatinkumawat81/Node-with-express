const express = require("express");
const moviesController = require('./../Controllers/moviesController')
const router = express.Router();
const authController = require('./../Controllers/authController');
// router.param('id',(req,res,next,value)=>{
    
// })
router.route('/highest-rated').get(moviesController.getHighestRated,moviesController.getAllMovies);
router.route('/movie-stats').get(moviesController.getMoviesStats);
router.route('/movie-by-genre/:genre').get(moviesController.getMovieByGenre);

router.route('/')
    .get(authController.protect,moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(authController.protect,moviesController.getMovie)
    .patch(authController.protect,moviesController.updateMovie)
    .delete(authController.protect,authController.restrict('admin'),moviesController.deleteMovie)
module.exports = router