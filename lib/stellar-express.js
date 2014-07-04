var _    = require("lodash");

var moduleStack = [
  require("./initializers/express"),
  require("./initializers/config"),
  require("./initializers/logging"),
  require("./initializers/db"),
  require("./initializers/app"),
  require("./initializers/errors"),
]

var stellarExpress = function(root, appInitializer) {
  this.root           = root;
  this.appInitializer = appInitializer;
  this.runModules('init');
};


stellarExpress.prototype.runModules = function(lifecycleEvent) {
  var self = this;

  _.each(moduleStack, function(module) {
    var fun = module[lifecycleEvent];

    if(fun) {
      fun.call(null, self);
    }
  });
}

//lifecycle events

stellarExpress.prototype.activate = function() {
  global.stex = this;
  this.runModules("activate");
}

stellarExpress.prototype.boot = function(appInitializer) {
  this.runModules("boot");
}

stellarExpress.prototype.shutdown = function() {
  this.runModules("shutdown");
}


// add framework facilities
stellarExpress.errors  = require("./util/errors");
stellarExpress.Promise = require("bluebird");
stellarExpress._       = require("lodash");

module.exports = stellarExpress;
