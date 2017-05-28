'use strict';

// load modules
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();

// set database connection
mongoose.connect('mongodb://localhost:27017/courseReview');
var db = mongoose.connection;
// mongodb connection error
db.on('error', console.error.bind(console, 'connection error:'));
// mongodb connection successful
db.on('open', console.log.bind(console, 'db connection established successfully'));

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// catch 404 and forward to global error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// start listening on our port
var server = app.listen(app.get('port'), function () {
  console.log('Express server is listening on port ' + server.address().port);
});