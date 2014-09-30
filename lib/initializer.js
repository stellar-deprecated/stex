var glob       = require("glob");
var path       = require("path");
var _          = require("lodash");
var sequencify = require("sequencify");
var Promise    = require("bluebird");
var requireAll = require("./util/require-all");


var Initializer = function(name, dep, fun) {
  if(typeof fun === 'undefined') {
    fun = dep;
    dep = [];
  }

  this.name = name;
  this.dep = dep;
  this.fun = fun;
}

Initializer.registered = {
  "startup": {},
  "shutdown": {}
}

Initializer.add = function(phase, name, dep, fun) {
  Initializer.registered[phase][name] = new Initializer(name, dep, fun);
};

// util functions

/**
 * Loads all initializers, returnin an array of Initializer objects founder undereath
 * `dir`/initializers.
 *
 * @param  {String} dir the directory to search underneath
 * @return {Array}     an array of Initializer objects
 */
Initializer.loadAll = function(dir) {
  var searchPath = path.join(dir, "/**/*.js");
  return _.values(requireAll(searchPath));
};


Initializer.run = function(stex, phase) {
  var seq          = sequence(Initializer.registered[phase]);
  var initializers = _.map(seq, function(name){ 
    return Initializer.registered[phase][name];
  });

  var runInitializer = function(initializer) {
    return initializer.fun.call(null, stex);
  }

  var reducer = function(prev, initializer) {
    return prev.then(function() {
      return initializer.fun.call(null, stex);
    });
  }

  return _.reduce(initializers, reducer, Promise.resolve(true))
    .catch(function(err) {
      console.log("Error running initializers!")
      console.log(err);
      process.exit(1);
    });
};


function sequence(initializers) {
  if(_.isEmpty(initializers)) { return ; }

  var initializers = _.cloneDeep(initializers);

  var results = []
  var names   = _.pluck(initializers, 'name');
  sequencify(initializers, names, results, []);

  return results;
}


module.exports = Initializer;
