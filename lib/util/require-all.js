var _    = require("lodash");
var glob = require("glob");

function requireAll(searchGlob) {
  var files = glob.sync(searchGlob);
  var exports = _.map(files, function(file) {
    return require(file);
  });

  return _.zipObject(files, exports);
}

module.exports = requireAll;