/**
 * Change the current working directory to the directory containing package.json,
 * if possible.
 */

var path     = require("path");
var fs       = require("fs");
var searchUp = require("./search-up");

module.exports = function() {
  // if we're not in a npm package, abort
  var foundPackage = searchUp(process.cwd(), "package.json")
  if(!foundPackage) { return; }

   process.chdir(foundPackage);
}

