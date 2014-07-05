var initializer = module.exports;

initializer.boot = function(stex) {
  var Knex  = require('knex');
  stex.db = global.db = Knex.initialize(stex.conf.get("db"));
};

initializer.shutdown = function(stex) {
  if(stex.db) {
    stex.db.client.pool.destroy();
  }
}