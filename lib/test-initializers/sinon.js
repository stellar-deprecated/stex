var Initializer = require("../initializer");

Initializer.add('startup', 'stex-dev.sinon', ['stex-dev.test'], function(stex) {
  stex.test.sinon = require("sinon");

  beforeEach(function() {
    this.sinon = stex.test.sinon.sandbox.create();
  });

  afterEach(function() {
    this.sinon.restore();
  });
});