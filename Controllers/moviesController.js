
const Movie = require('./../Models/movieModel');
const ApiFeatures = require('./../Utils/ApiFeatures');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const CustomError = require('./../Utils/CustomError');

exports.getHighestRated = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-raring'
    next();
}
exports.getAllMovies = asyncErrorHandler(async (req,res,next) =>{
    const features = new ApiFeatures(Movie.find(),req.query).sort().filter().limitFeild().pagination();
    let movies = await features.query;
    res.status(200).json({
        status: 'success',
        length : movies.length,
        data: {
            movies
        }
    })
})

exports.createMovie = asyncErrorHandler(async (req,res,next) => {
    const movie = await Movie.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            movie
        }
    })
})

exports.getMovie = asyncErrorHandler(async (req,res,next) => {
    // const movie = await Movie.find({_id: req.params.id});
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        const error = new CustomError('Movie with ID is not found!',404);
        return next(error);
    }
    res.status(200).json({
        status: 'success',
        data: {
            movie
        }
    })
})

exports.updateMovie = asyncErrorHandler(async (req,res,next) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true});
    if(!movie){
        const error = new CustomError('Movie with ID is not found!',404);
        return next(error);
    }
    res.status(200).json({
        status: 'success',
        data: {
            movie
        }
    })
})

exports.deleteMovie = asyncErrorHandler(async (req,res,next) =>{
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie){
        const error = new CustomError('Movie with ID is not found!',404);
        return next(error);
    }
        res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getMoviesStats = asyncErrorHandler(async (req,res,next) => {
    const stats = await Movie.aggregate([
        { $match: {rating: {$gte: 7.9}}},
        { $group: {
            _id: '$releaseYear',
            avgRating: { $avg: '$rating'},
            avgPrice: { $avg: '$price'},
            minPrice: { $min: '$price'},
            maxPrice: { $max: '$price'},
            priceTotal: { $sum: '$price'},
            movieCount: { $sum: 1}
        }},
        {$sort: {minPrice: 1}},
        // { $match: {maxPrice: {$gte: 60}}},
    ]);        
    res.status(200).json({
        status: 'success',
        count: stats.length,
        data: stats
    })
})

exports.getMovieByGenre = asyncErrorHandler(async (req,res,next) => {
    const genre = req.params.genre;
    const movie = await Movie.aggregate([
        {$unwind: '$genres'},
        {$group: {
            _id: '$genres',
            movieCount: { $sum: 1},
            movies: {$push: '$name'},
        }},
        {$addFields: {genre:'$_id'}},
        {$project: {_id: 0}},
        {$sort: {movieCount: -1}},
        // {$limit: 6}
        {$match: {genre: genre}}
    ]);
    res.status(200).json({
        status: 'success',
        count: movie.length,
        movie
    })
})