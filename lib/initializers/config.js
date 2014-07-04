var nconf = require("nconf");
module.exports = function (app) {
  var env   = process.env.NODE_ENV || "development";
  global.conf = module.exports.loadEnv(env);
  conf.NODE_ENV = env;
};

module.exports.loadEnv = function(env) {
  var jsonWithCommentsFormat = require(__dirname + "/../util/nconf").jsonWithCommentsFormat;
  // NOTE!!!! reverse order priority env is higher priority than env-file, etc.
  var provider = new nconf.Provider();
  provider
    .env()
    .file('env-file',  { file:app.root + '/config/' + env + '.json', format:jsonWithCommentsFormat})
    .file('all-envs',  { file:app.root + '/config/all-envs.json', format:jsonWithCommentsFormat});

  return provider;
}