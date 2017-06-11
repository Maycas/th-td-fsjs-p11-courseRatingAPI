'use strict';

// Required libraries
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');

// Define User schema
var UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'User\'s full name is required']
    },
    emailAddress: {
        type: String,
        required: [true, 'Email Address is required'],
        unique: true,
        validate: {
            validator: function (email) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            },
            message: 'Email Address must be on a valid format'
        }
    },
    password: {
        type: String,
        required: [true, 'User\'s password is required']
    }
});

UserSchema.plugin(uniqueValidator);

// Pre-save hook to hash the password
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        return next();
    });
});

// Static authentication method
UserSchema.statics.authentication = function (emailAddress, password, callback) {
    User.findOne({
        emailAddress: emailAddress
    }, function (err, user) {
        if (err) {
            return callback(err);
        } else if (!user) {
            var error = new Error('User Not Found');
            err.status = 401;
            return callback(error);
        }
        // A user is found and no error has been fired, then compare the passwords
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                return callback(null, user); // no error
            } else {
                var error = new Error('Unauthorised');
                error.status = 401;
                return callback(error);
            }
        });
    });
};

// Create a model and export it
var User = mongoose.model('User', UserSchema);
module.exports = User;