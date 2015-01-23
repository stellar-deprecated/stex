var Initializer = require("../initializer");


Initializer.add('startup', 'stex.metrics', ['stex.config', 'stex.logging'], function(stex) {
  var statsd = stex.conf.get("statsd") || false;

  if (statsd) {
    var lynx = require("lynx");
    var metrics = new lynx(statsd.host, statsd.port, {
        scope: statsd.scope || ""
        on_error: function onError(err) {
          log.error(err);
        }
    });
    stex.metrics = metrics;
  }
});