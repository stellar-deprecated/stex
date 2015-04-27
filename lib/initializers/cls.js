var Initializer     = require("../initializer");
var createNamespace = require('continuation-local-storage').createNamespace;
var getNamespace    = require('continuation-local-storage').getNamespace;
var patchBluebird   = require("cls-bluebird");
var uuid            = require("uuid");

Initializer.add('startup', 'stex.cls', ['stex.config'], function(stex) {
  var namespaceName = stex.conf.get('cls-namespace') || "org.stellar.stex";
  var namespace = createNamespace(namespaceName);
  patchBluebird(namespace);

  stex.cls = {
    get: function(name) {
      var namespace = getNamespace(namespaceName);
      return namespace.get(name);
    },
    getNamespace: function () {
      return getNamespace(namespaceName);
    }
  }
});
