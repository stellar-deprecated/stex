var glob       = require("glob");
var path       = require("path");
var _          = require("lodash");
var sequencify = require("sequencify");
var Promise    = require("bluebird");
var requireAll = require("./util/require-all");


var Initializer = function(name) {
  this.name = name;
  this.dep = [];
  this.fun = null;
};

Initializer.prototype.addDep = function(name) {
  this.dep.push(name);
};

Initializer.prototype.setFun = function(fun) {
  if(this.fun) {
    throw new Error("Cannot overwrite initializer function for: " + this.name);
  }

  this.fun = fun;
};

Initializer.registered = {
  "startup": {},
  "shutdown": {}
};

Initializer.add = function(phase, name, dep, fun) {
  var before, after;

  if (typeof fun === 'undefined') {
    fun = dep;
    dep = [];
  }

  if (_.isPlainObject(dep)) {
    before = dep.before || [];
    after = dep.after || [];
  } else {
    after = dep || [];
  }

  var init = Initializer.get(phase, name);

  _.each(after, function(dep) { init.addDep(dep); });
  _.each(before, function(dep) { Initializer.get(phase, dep).addDep(name); });

  init.setFun(fun);

  return init;
};

Initializer.get = function(phase, name) {
  var init = Initializer.registered[phase][name];

  if(!init) {
    init = Initializer.registered[phase][name] = new Initializer(name);
  }

  return init;
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
    if(!initializer.fun) {
      return Promise.resolve();
    }
    
    return initializer.fun.call(null, stex);
  };

  var reducer = function(prev, initializer) {
    return prev.then(function() {
      return runInitializer(initializer);
    });
  };

  return _.reduce(initializers, reducer, Promise.resolve(true))
    .catch(function(err) {
      console.error("Error running initializers!");
      console.error(err);
      console.error(err.stack);
      process.exit(1);
    });
};


function sequence(initializers) {
  if(_.isEmpty(initializers)) { return ; }

  initializers = _.cloneDeep(initializers);

  var results = [];
  var names   = _.pluck(initializers, 'name');
  sequencify(initializers, names, results, []);

  return results;
}


module.exports = Initializer;
