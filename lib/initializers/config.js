var nconf = require("nconf");

var initializer = module.exports;

initializer.init = function(stex) {
  var env  = process.env.NODE_ENV || "development";
  stex.conf = module.exports.loadEnv(stex, env);
  stex.conf.NODE_ENV = env;
};

initializer.activate = function(stex) {
  global.conf = stex.conf;
}

initializer.loadEnv = function(stex, env) {
  var jsonWithCommentsFormat = require("../util/nconf").jsonWithCommentsFormat;
  // NOTE!!!! reverse order priority env is higher priority than env-file, etc.
  var provider = new nconf.Provider();
  provider
    .env()
    .file('env-file',  { file:stex.root + '/config/' + env + '.json', format:jsonWithCommentsFormat})
    .file('all-envs',  { file:stex.root + '/config/all-envs.json', format:jsonWithCommentsFormat});

  return provider;
}