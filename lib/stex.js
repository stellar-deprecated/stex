var _        = require("lodash");
var Promise  = require("bluebird");
var searchUp = require("./util/search-up");

var moduleStack = [
  "./initializers/express",
  "./initializers/config",
  "./initializers/logging",
  "./initializers/db",
  "./initializers/app",
  "./initializers/errors"
]

var Stex = function(baseDir, appInitializer) {
  this.root           = searchUp(baseDir, "package.json");
  this.appInitializer = appInitializer;

  if(!this.root) {
    throw new Error("cannot find package.json");
  }

  var packageJson = require(this.root + "/package.json");
  this.name = packageJson.name;
  return this.runInitializers('init');
};


// intialization funcs
Stex.prototype.runInitializers = function(lifecycleEvent) {
  var self = this;

  var runInitializer = function(path) {
    return function() {
      var module = require(path);
      var fun = module[lifecycleEvent];

      if(fun) {
        return fun.call(null, self);
      }
    };
  }

  var runPromise = _.reduce(moduleStack, function(prev, path) {
    return prev
      .then(runInitializer(path));
  }, Promise.resolve(true));

  return  runPromise.then(function() {
            return self;
          })
          .catch(function(err) {
            console.log("Error running initializers!")
            console.log(err);
            process.exit(1);
          })
}

//lifecycle events

Stex.prototype.activate = function() {
  global.stex = this;
  return this.runInitializers("activate");
}

Stex.prototype.boot = function(appInitializer) {
  return this.runInitializers("boot");
}

Stex.prototype.shutdown = function() {
  return this.runInitializers("shutdown");
}

// add framework facilities
Stex.errors  = require("./util/errors");
Stex.Promise = require("bluebird");
Stex._       = require("lodash");
Stex.Knex    = require("knex");

module.exports = Stex;
