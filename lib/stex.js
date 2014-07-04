var _    = require("lodash");

var moduleStack = [
  require("./initializers/express"),
  require("./initializers/config"),
  require("./initializers/logging"),
  require("./initializers/db"),
  require("./initializers/app"),
  require("./initializers/errors"),
]

var Stex = function(root, appInitializer) {
  this.root           = root;
  this.appInitializer = appInitializer;
  this.runModules('init');
};


Stex.prototype.runModules = function(lifecycleEvent) {
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
  this.runModules("activate");
  return this;
}

Stex.prototype.boot = function(appInitializer) {
  this.runModules("boot");
  return this;
}

Stex.prototype.shutdown = function() {
  this.runModules("shutdown");
  return this;
}


// add framework facilities
Stex.errors  = require("./util/errors");
Stex.Promise = require("bluebird");
Stex._       = require("lodash");

module.exports = Stex;
