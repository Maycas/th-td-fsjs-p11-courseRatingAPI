'use strict';

// load modules
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//routes
var userRoutes = require('./routes/users');
var courseRoutes = require('./routes/courses');

var app = express();

// set database connection
mongoose.connect('mongodb://localhost:27017/courseReview');
mongoose.Promise = global.Promise; // solves deprecation warning problem by plugging the global Javascript promise library (DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html)
var db = mongoose.connection;
// mongodb connection error
db.on('error', console.error.bind(console, 'connection error:'));
// mongodb connection successful
db.once('open', function (err) {
  require('./utils/seeder.js');
  console.log.bind(console, 'db connection established successfully')
});

// set our port
app.set('port', process.env.PORT || 5000);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// morgan gives us http request logging
app.use(morgan('dev'));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// include routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);

// catch 404 and forward to global error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json(err);
});

// start listening on our port
var server = app.listen(app.get('port'), function () {
  console.log('Express server is listening on port ' + server.address().port);
});