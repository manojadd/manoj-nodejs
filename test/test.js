var assert = require("chai").assert;
var chai = require("chai");
var chaiHttp = require("chai-http");
var app = require("../app.js");
var dataFromFile = require("../public/data.json");
var fs = require('fs');
var path = require('path');
chai.use(chaiHttp);
const del = require('del');

var requester = chai.request(app).keepOpen();


describe('all the apis', function () {
  describe('/data/amount-range api', function () {
    it('returns an array of data for valid input', function (done) {
      requester.get('/users/data/amount-range?min=1000&max=3000')
        .end((err, res) => {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.deepEqual(res.body, [{
            "name": "manoj",
            "amount": 2000,
            "id": 1,
            "date": "2018-01-01"
          }], 'The results should be as expected')
          done();
        })
    });
    it('returns 402 when there is a query param missing', function (done) {
      requester.get('/users/data/amount-range?min=1000')
        .end((err, res) => {
          assert.equal(res.status, 402, 'it should send a 402 on missing query string');
          assert.deepEqual(res.body, {
            reason: 'NEED_RANGE'
          }, "The reason should be given");
          done();
        })
    })

  });
  describe('/data', function () {
    it('returns an array of data from file', function (done) {
      requester.get('/users/data')
        .end((err, res) => {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.deepEqual(JSON.parse(res.body), dataFromFile, 'The results should be as what in file')
          done();
        })
    });
  });
  describe('/data/files', function () {
    before(()=>{
      del.sync([path.resolve(__dirname,'./temp/*.json')]);
    })
    it('creates a file successfully', function (done) {
      let obj = {
        "hi": "hello"
      };
      requester.post('/users/data/files')
        .send(obj)
        .end((err,res) => {
          assert.equal(res.status, 201, 'response status should be 201');
          fs.readFile(path.resolve(__dirname, './temp/newData.json'), 'utf-8', (err, response) => {
            let result = JSON.parse(response);
            assert.deepEqual(obj, result, 'The result should be what we sent in post');
            done();
          })
        })
    });
  });
  
  describe('/non-repeating-character', function () {
    it('finds the first non repeating character successfully', function (done) {
      requester.get('/users/non-repeating-character?name=hhheeelooo')
        .end((err, res) => {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.deepEqual(res.body.result, 'l' , 'l is the first non repeating character');
          done();
        })
    });
  });
});