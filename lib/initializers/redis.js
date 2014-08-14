var Initializer = require("../initializer");
var Promise     = require("bluebird");
var redis       = Promise.promisifyAll(require("redis"));

Initializer.add('startup', 'stex.redis', ['stex.config'], function(stex) {
  var redisConf = conf.get("redis");
  if(!redisConf) {
    return;
  }
  
  stex.redis = redis.createClient(redisConf.port || 6379, redisConf.host, null);

  return stex.redis.selectAsync(redisConf.db || 0);
});

Initializer.add('shutdown', 'stex.redis', function(stex) {
  if(stex.redis) {
    stex.redis.quit();
  }
});