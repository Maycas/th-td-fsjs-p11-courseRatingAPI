'use strict';

// Required libraries
var mongoose = require('mongoose');

// Define Course Schema
var CourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Course title is required']
    },
    description: {
        type: String,
        required: [true, 'Course description is required']
    },
    estimatedTime: String,
    materialsNeeded: String,
    steps: [{
        stepNumber: Number,
        title: {
            type: String,
            required: [true, 'Course step title is required']
        },
        description: {
            type: String,
            required: [true, 'Course step description is required']
        }
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

// Create model and export it
var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;