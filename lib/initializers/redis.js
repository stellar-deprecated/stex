var Initializer = require("../initializer");

Initializer.add('startup', 'stex.redis', ['stex.config', 'stex.newrelic'], function(stex) {
  var Promise     = require("bluebird");
  var redis       = Promise.promisifyAll(require("redis"));
  var redisConf = conf.get("redis");
  if(!redisConf) {
    return;
  }
  
  stex.redis = redis.createClient(redisConf.port || 6379, redisConf.host, null);

  if (redisConf.password) {
    stex.redis.auth(redisConf.password, function() {console.log("Connected!");});
  }

  return stex.redis.selectAsync(redisConf.db || 0);
});

Initializer.add('shutdown', 'stex.redis', function(stex) {
  if(stex.redis) {
    stex.redis.quit();
  }
});
