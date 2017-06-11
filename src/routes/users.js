'use strict';

/**
 * API Description
 * 
 * /users   - GET   | Returns the currently authenticated user (200)
 * /users   - POST  | Creates a new user (201)
 * 
 */

// Required libraries
var express = require('express');
var router = express.Router();
var auth = require('../middleware').authenticate;

// Required models
var User = require('../models/user');

// Routes

/**
 * GET the currently authenticated user
 * 
 * Route: /users
 */
router.get('/users', auth, function (req, res, next) {
    if (req.user) {
        return res.json(req.user);
    }
});


/**
 * POST a new user, sets the location header to '/' and returns no content
 * 
 * Route: /users
 */
router.post('/users', function (req, res, next) {
    var user = new User(req.body);
    user.save(function (err, user) {
        if (err) {
            err.status = 400;
            return next(err);
        }
        res.status(201);
        res.location('/');
        res.send();
    });
});


module.exports = router;