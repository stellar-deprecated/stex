var Initializer = require("../initializer");

Initializer.add('startup', 'stex-dev.chai', ['stex-dev.test'], function(stex) {
  stex.test.chai = require("chai");
  stex.test.chai.use(require('chai-properties'));
  stex.test.chai.use(require('chai-as-promised'));

  global.expect = stex.test.chai.expect;
});