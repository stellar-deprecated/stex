var Initializer = require("../initializer");

Initializer.add('startup', 'stex-dev.test', ['stex.config'], function(stex) {
  var join = require('path').join;

  stex.test = {};
  stex.test.root = join(stex.root, "test");

  global.test = stex.test;
});