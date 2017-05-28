'use strict';

// Required libraries
var mongoose = require('mongoose');

// Define Review Schema
var ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be >= 1'],
        max: [5, 'Rating must be <= 5']
    },
    review: String
});

// Create model and export it
var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;