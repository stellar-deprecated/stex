var Initializer = require("../initializer");

Initializer.add('startup', 'stex-dev.test', ['stex.config'], function(stex) {
  stex.test = {};
  global.test = stex.test;
});