var Initializer = require("../initializer");

Initializer.add('startup', 'stex.initialize-app', ['stex.express'], function(stex) {
  stex.appInitializer(stex);
  stex.app.use("/", stex.router);
});