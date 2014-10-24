var Initializer = require("../initializer");

Initializer.add('startup', 'stex.initialize-app', ['stex.autoload', 'stex.express', 'stex.request-domains', 'stex.request-logging'], function(stex) {
  stex.appInitializer(stex);
  stex.app.use("/", stex.router);
});
