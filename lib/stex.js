var _           = require("lodash");
var searchUp    = require("./util/search-up");
var Initializer = require("./initializer");

// NOTE:  don't directly instantiate Stex... use the .new async method below
var Stex = function(baseDir, appInitializer) {
  this.root           = searchUp(baseDir, "package.json");
  this.appInitializer = appInitializer;

  if(!this.root) {
    throw new Error("cannot find package.json");
  }

  var packageJson = require(this.root + "/package.json");
  this.name = packageJson.name;
};

Stex.new = function(baseDir, appInitializer) {
  return new Stex(baseDir, appInitializer);
}

//lifecycle events
Stex.prototype.init = function(isTest) {
  if(global.stex) {
    throw new Error("Cannot initialize a stex application twice");
  }

  var self = this;
  global.stex = this;

  Initializer.loadAll(__dirname + "/initializers");
  Initializer.loadAll(this.root + "/lib/initializers");

  if (isTest === true) {
    Initializer.loadAll(__dirname + "/test-initializers");
  }
  
  return Initializer.run(this, 'startup').then(function() {
    return self;
  });
};

Stex.prototype.activate = function() {
  //DEPRECATED
  //NOOP
};

Stex.prototype.shutdown = function() {
  return Initializer.run(this, 'shutdown');
}

// add framework facilities
Stex.errors    = require("./util/errors");
Stex.Promise   = require("bluebird");
Stex._         = require("lodash");
Stex.Knex      = require("knex");
Stex.dbMigrate = require("db-migrate");

module.exports = Stex;
