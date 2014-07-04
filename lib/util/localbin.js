/**
 * This module makes is easy to re-exec a binary that is installed globally
 * (so it's in the PATH) with the local version your project uses (so you get
 * the latest functionality)
 */

var kexec    = require("kexec");
var path     = require("path");
var fs       = require("fs");
var searchUp = require("./search-up");

module.exports = function() {
  // if we're not in a npm package, abort
  var foundPackage = searchUp(process.cwd(), "package.json")
  if(!foundPackage) { return; }

  // if the local package doesn't use stex, abort
  var stexPath = path.join(foundPackage, "node_modules", ".bin", "stex");
  if(!fs.existsSync(stexPath)) { return; }

  // if we are already running the local version, abort
  if(stexPath == process.argv[1]) { return; }

  // finally, rexec with the local version
  kexec(stexPath, process.argv.slice(2));
}

