var Initializer = require("../initializer");
var requireAll  = require("../util/require-all");
var path        = require("path");

var DEPS = [
  'stex-dev.supertest', 
  'stex-dev.chai',
  'stex-dev.sinon',
];

Initializer.add('startup', 'stex-dev.test.support', DEPS, function(stex) {
  stex.test.support = requireAll(path.join(stex.test.root, "**", "*.js"));
});