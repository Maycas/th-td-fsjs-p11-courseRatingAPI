'use strict';

/**
 * API Description
 * 
 * /courses                     - GET   | Returns the course '_id' and 'title' properties (200)
 * /courses/:courseId           - GET   | Returns all course properties and related documents for the provided courseId (200)
 * /courses                     - POST  | Creates a course, sets the Location header to '/' and returns no content (201)
 * /courses/:courseId           - PUT   | Updates a course and returns no content (204)
 * /courses/:courseId/reviews   - POST  | Creates a review for the specified course ID, sets the Location header to the related course, and returns no content (201)
 */


// Required libraries
var express = require('express');
var router = express.Router();
var auth = require('../middleware').authenticate;

// Required models
var User = require('../models/user');
var Course = require('../models/course');
var Review = require('../models/review');

// Routes
router.get('/courses', function (req, res, next) {
    Course.find({}, 'title', function (err, courses) {
        if (err) return next(err);
        res.json(courses);
    });
});

router.get('/courses/:courseId', function (req, res, next) {
    Course.findById(req.params.courseId)
        .populate('user reviews')
        .exec(function (err, course) {
            if (err) return next(err);
            res.json(course);
        });
});

router.post('/courses', auth, function (req, res, next) {
    if (req.user) {
        var course = new Course(req.body);
        course.save(function (err, course) {
            if (err) {
                err.status = 400;
                return next(err);
            }
            res.status(201);
            res.location('/');
            res.send();
        });
    }
});

router.put('/courses/:courseId', auth, function (req, res, next) {
    if (req.user) {
        Course.findOneAndUpdate(req.params.courseId, req.body, function (err, course) {
            if (err) {
                err.status = 400;
                return next(err);
            }
            res.status(204);
            res.send();
        });
    }
});

router.post('/courses/:courseId/reviews', auth, function (req, res, next) {
    if (req.user) {
        Course.findById(req.params.courseId, function (err, course) {
            var review = new Review(req.body);

            review.save(review, function (err, review) {
                if (err) {
                    err.status = 400;
                    return next(err);
                }
                course.reviews.push(review);
                course.save(function (err, course) {
                    if (err) {
                        err.status = 400;
                        return next(err);
                    }
                    res.status(201);
                    res.location('/' + course._id);
                    res.send();
                });
            });
        });
    }
});

module.exports = router;