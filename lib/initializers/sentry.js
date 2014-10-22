var Initializer = require("../initializer");

Initializer.add('startup', 'stex.sentry', ['stex.config'], function(stex) {
  var sentryDsn = stex.conf.get("sentryDsn") || false;

  if (sentryDsn) {
    var raven = require('raven');
    stex.sentry = new raven.Client(sentryDsn);
  }
});