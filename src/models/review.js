'use strict';

// Required libraries
var mongoose = require('mongoose');

// Required models
var Course = require('./course');

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

// Pre-save hook to prevent a user to review their own course
ReviewSchema.pre('save', function (next) {
    var currentReview = this;
    Course.findOne({
        reviews: currentReview._id
    }, function (err, course) {
        if (err) return next(err);
        if (course) {
            if (currentReview.user.toString() === course.user.toString()) {
                var error = new Error('User can\'t review its own course');
                error.status = 503;
                return next(error);
            }
        }
        return next();
    });
});

// Create model and export it
var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;