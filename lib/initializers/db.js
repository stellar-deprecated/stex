var Initializer = require("../initializer");

Initializer.add('startup', 'stex.db', ['stex.config', 'stex.logging', 'stex.newrelic'], function(stex) {
  var Knex = require('knex');
  stex.db  = Knex.initialize(stex.conf.get("db"));

  stex.db.on("query", function(query) {
    log.info({
      type: 'query',
      sql: query.sql
    })
  });

  global.db = stex.db;
});

Initializer.add('shutdown', 'stex.db', function(stex) {
  if(stex.db) {
    stex.db.client.pool.destroy();
  }
});