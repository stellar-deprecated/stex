var path     = require("path");
var fs       = require("fs");

/**
 * Given a starting directory and a file you would like to find, this
 * function recursively searchs up the tree until finding it.
 * 
 * @param  {String} directory to search searching from
 * @param  {String} query the file you want search for somewhere up the tree
 * @return {String} the found directory containing `query` or undefined if nothing found
 */
function searchUp(directory, query) {
  var packagePath = path.join(directory, query)

  if(fs.existsSync(packagePath)) {
    return directory;
  } else {
    var nextDir = path.dirname(directory);

    // if we're at the root
    if(nextDir === directory) { return; }

    return searchUp(nextDir, query);
  }
}

module.exports = searchUp;