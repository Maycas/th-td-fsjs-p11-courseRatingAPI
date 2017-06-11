'use strict';

// Required libraries
var auth = require('basic-auth');

// Required models
var User = require('../models/user');

/**
 * @name authenticate
 * @description 
 * 
 * @param {Object} req  - Request Express Object
 * @param {Object} res  - Response Express Object
 * @param {Function} next - Next middleware function in Express
 */
function authenticate(req, res, next) {
    var user = auth(req);

    if (user) {
        var emailAddress = user.name;
        var password = user.pass;

        User.authentication(emailAddress, password, function (err, user) {
            if (err) {
                return next(err);
            } else {
                req.user = user;
                return next();
            }
        });
    } else {
        var err = new Error('Unathorised');
        err.status = 401;
        return next(err);
    }
}


// Exports
module.exports.authenticate = authenticate;