var stex = require(process.cwd() + "/lib/app");
// db-migrate compatible config file generator
var config = require("../initializers/config");

function getDbConfigForEnvironment(env) {
  var conf = config.loadEnv(stex, env);
  var knexConfig =  conf.get("db");

  if (typeof knexConfig === 'undefined') {
    return {};
  }

  var dbMigrateConfig      = {};
  dbMigrateConfig.driver   = knexConfig.client;
  dbMigrateConfig.user     = knexConfig.connection.user;
  dbMigrateConfig.database = knexConfig.connection.database;

  if(knexConfig.connection.host) {
    dbMigrateConfig.host = knexConfig.connection.host;
  }

  if(knexConfig.connection.port) {
    dbMigrateConfig.port = knexConfig.connection.port;
  }

  if(knexConfig.connection.password) {
    dbMigrateConfig.password = knexConfig.connection.password;
  }

  return dbMigrateConfig;
}

var config = {
  development: getDbConfigForEnvironment("development"),
  test:        getDbConfigForEnvironment("test"),
  production:  getDbConfigForEnvironment("production"),
  dev:         getDbConfigForEnvironment("dev"),
  tst:         getDbConfigForEnvironment("tst"),
  stg:         getDbConfigForEnvironment("stg"),
  prd:         getDbConfigForEnvironment("prd")
};

module.exports = config;
