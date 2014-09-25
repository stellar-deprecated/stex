var Initializer = require("../initializer");

Initializer.add('startup', 'stex-dev.supertest', ['stex-dev.test', 'stex-dev.chai'], function(stex) {
  stex.test.supertest           = require("supertest");
  stex.test.supertestAsPromised = require("supertest-as-promised");

  //expectBody helper
  stex.test.supertest.Test.prototype.expectBody = function(body) {
    return this.expect(function(res) {
      stex.test.chai.expect(res.body).to.have.properties(body);
    });
  };
});