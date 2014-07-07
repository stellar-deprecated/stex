var Promise     = require("bluebird");
var redis       = Promise.promisifyAll(require("redis"));
var initializer = module.exports;

initializer.boot = function(stex) {
  var redisConf = conf.get("redis");
  if(!redisConf) {
    return;
  }
  
  stex.redis = redis.createClient(redisConf.port, redisConf.host, null);

  return stex.redis.selectAsync(redisConf.db || 0);
};

initializer.shutdown = function(stex) {
  if(stex.redis) {
    stex.redis.quit();
  }
};