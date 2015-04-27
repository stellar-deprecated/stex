var Initializer     = require("../initializer");
var createNamespace = require('continuation-local-storage').createNamespace;
var getNamespace    = require('continuation-local-storage').getNamespace;
var patchBluebird   = require("cls-bluebird");
var uuid            = require("uuid");

Initializer.add('startup', 'stex.cls', ['stex.config', 'stex.express'], function(stex) {
  var namespaceName = stex.conf.get('cls-namespace') || "org.stellar.stex";
  var namespace = createNamespace(namespaceName);
  patchBluebird(namespace);

  // create a transaction id for each request
  app.use(function(req, res, next) {
    var requestId = uuid.v4();

    // wrap the events from request and response
    namespace.bindEmitter(req);
    namespace.bindEmitter(res);

    // run following middleware in the scope of
    // the namespace we created
    namespace.run(function() {

      // set requestId on the namespace, makes it
      // available for all continuations
      namespace.set('requestId', requestId);
      next();
    });
  });

  stex.cls = {
    get: function(data) {
      var namespace = getNamespace(namespaceName);
      return namespace.get(data);
    }
  }
});
