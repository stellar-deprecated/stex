var Initializer = require("../initializer");
var requireAll  = require("../util/require-all");
var path        = require("path");
var _           = require("lodash");
var Inflector   = require("inflected");

Initializer.add('startup', 'stex.autoload', ['stex.express'], function(stex) {
  stex.controllers = autoload(path.join(stex.root, "lib", "controllers"));
  stex.models      = autoload(path.join(stex.root, "lib", "models"));  
});

function autoload(root) {
  root         = path.normalize(root);
  var loadGlob = path.join(root, "**", "*.js");
  var loaded   = requireAll(loadGlob);
  var nestedExports = _.map(loaded, function(exports, filename) {
    
    filename             = path.normalize(filename);
    var withoutBase      = filename.slice(root.length + 1);
    var withoutExtension = withoutBase.slice(0, -3);
    var modulePath       = withoutExtension.split(path.sep).map(normalizeToPropertyName);

    return objectFromModulePath(modulePath, exports);
    
  });
  
  //
  return _.reduce(nestedExports, _.merge);
}

/**
 * Transforms an the flat module path `["foo", "bar"]` into the object of the form
 * `{foo: bar: exports}`, which is suitable to merge into a single object will all
 * other autoloaded modules
 */
function objectFromModulePath(modulePath, exports) {
  var result = null;
  var reverseModulePath = modulePath.reverse();
  
  // build up the result from the inside out;
  return _.reduce(reverseModulePath, function(current, modulePathComponent) {
    var next = {};
    next[modulePathComponent] = current;
    return next;
  }, exports);
}

/**
 * Transorms a dasherized path component to a suitable camelcased name
 */
function normalizeToPropertyName(modulePathComponent) {
  var underscored = Inflector.underscore(modulePathComponent);
  var camelCased  = Inflector.camelize(underscored, false);
  
  return camelCased;
}
