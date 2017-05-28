'use strict';

// Required libraries
var mongoose = require('mongoose');

// Define User schema
var UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'User\'s full name is required']
    },
    emailAddress: {
        type: String,
        required: [true, 'Email Address is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'User\'s password is required']
    }
});

// emailAddress validators
// Email must have a valid format
UserSchema.path('emailAddress').validate(function (email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}, '{PATH} must be on a valid format');
// Email must be unique
UserSchema.path('emailAddress').validate(function (value, done) {
    this.model('User').count({
        emailAddress: value
    }, function (err, count) {
        if (err) {
            return done(err);
        }
        // If `count` is greater than zero, "invalidate"
        done(!count);
    });
}, 'Email Address already exists');

// Create a model and export it
var User = mongoose.model('User', UserSchema);
module.exports = User;