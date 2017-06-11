'use strict';

// Required libraries
var seeder = require('mongoose-seeder');
var data = require('../data/data.json');

// Seed the data
seeder
    .seed(data, {
        dropDatabase: true
    }).then(function (dbData) {
        console.log('Database cleaned and seeded with data');
        console.log(dbData);
    })
    .catch(function (err) {
        console.log(err);
    });