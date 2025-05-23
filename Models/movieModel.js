const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required field!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Dration is required feild!']
    },
    rating:{
        type: Number,
        validate: {
            validator: function(value){
                return value >=1 && value <=10;
            },
            message: 'Ratings ({VALUE}) should be above one and below 10.'

        }
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release Year is required feild!']
    },
    releaseDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    genres: {
        type: [String],
        required: [true, 'Genres is required feild!'],
        // enum: {values: ['Action'], message: 'This genres is not exit.'}
    },
    directors: {
        type: [String],
        required: [true, 'Directors is required feild!']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover Image is required feild!']
    },
    actors: {
        type: [String],
        required: [true, 'Actors is required feild!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required feild!']
    },
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

movieSchema.virtual('durationInHours').get(function(){
    return this.duration / 60
});

//Executed before the document is saved in DB
//.save() or .create()
//insertMany, findByIdAndUpdate will not work
movieSchema.pre(/^find/,function(next){
    this.find({releaseDate: {$lte: Date.now()}});
    next();
});
movieSchema.pre('aggregate',function(next){
    next();
});
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;