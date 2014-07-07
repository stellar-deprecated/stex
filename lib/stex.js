var _        = require("lodash");
var searchUp = require("./util/search-up");

var moduleStack = [
  require("./initializers/express"),
  require("./initializers/config"),
  require("./initializers/logging"),
  require("./initializers/db"),
  require("./initializers/app"),
  require("./initializers/errors"),
]

var Stex = function(baseDir, appInitializer) {
  this.root           = searchUp(baseDir, "package.json");
  this.appInitializer = appInitializer;

  if(!this.root) {
    throw new Error("cannot find package.json");
  }

  var packageJson = require(this.root + "/package.json");
  this.name = packageJson.name;
  this.runInitializers('init');
};


Stex.prototype.runInitializers = function(lifecycleEvent) {
  var self = this;

  _.each(moduleStack, function(module) {
    var fun = module[lifecycleEvent];

    if(fun) {
      fun.call(null, self);
    }
  });
}

//lifecycle events

Stex.prototype.activate = function() {
  global.stex = this;
  this.runInitializers("activate");
  return this;
}

Stex.prototype.boot = function(appInitializer) {
  this.runInitializers("boot");
  return this;
}

Stex.prototype.shutdown = function() {
  this.runInitializers("shutdown");
  return this;
}


// add framework facilities
Stex.errors  = require("./util/errors");
Stex.Promise = require("bluebird");
Stex._       = require("lodash");
Stex.Knex    = require("knex");

module.exports = Stex;
