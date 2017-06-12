'use strict';

process.env.NODE_ENV = 'test';

// Required libraries
var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var seeder = require('mongoose-seeder');
var data = require('../data/data.json');
var server = require('../index.js');

chai.use(chaiHttp);

// Helper function to set up the database for each test suite
function mongooseConnectAndSetup(done) {
    mongoose.connection.once('open', function () {
        seeder.seed(data, {
                dropDatabase: true
            })
            .then(function () {
                done();
            })
            .catch(function (err) {
                console.log(err);
            });
    });
}

// Test suites
describe('User credentials', function () {

    before(mongooseConnectAndSetup);

    it('/api/user should return the corresponding user document when using the right credentials', function (done) {
        chai.request(server)
            .get('/api/users')
            .auth('sam@jones.com', 'password')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                expect(res.body.fullName).to.equal('Sam Jones');
                expect(res.body.emailAddress).to.equal('sam@jones.com');
                done();
            });
    });

    it('/api/courses/:courseId should return a 401 status error if accessing with invalid credentials', function (done) {
        var courseId = '57029ed4795118be119cc43d';
        chai.request(server)
            .get('/api/courses/' + courseId)
            .auth('sam@jones.com', 'wrong password')
            .end(function (err, res) {
                expect(res.status).to.equal(401);
                done();
            });
    });
});