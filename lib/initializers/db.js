var Initializer = require("../initializer");
var _ = require('lodash');

Initializer.add('startup', 'stex.db', ['stex.config', 'stex.logging', 'stex.newrelic'], function(stex) {
  var Knex = require('knex');
  var config = stex.conf.get("db");
  config.connection = _.extend(config.connection, {
    stringifyObjects: true
  });
  stex.db  = Knex.initialize(config);

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