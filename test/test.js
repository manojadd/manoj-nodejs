var assert = require("chai").assert;
var fetch = require("node-fetch");

console.log(process.env.NODE_ENV);

describe('all the apis', function() {
  describe('/data/amount-range api', function() {
    it('returns an array of data', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});