var Initializer = require("../initializer");


Initializer.add('startup', 'stex.newrelic', ['stex.config'], function(stex) {
  var useNewRelic = stex.conf.get("useNewRelic") || false;

  if (useNewRelic) {
    stex.newrelic = require('newrelic');
  }
  
});