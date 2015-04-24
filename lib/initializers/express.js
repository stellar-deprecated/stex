var Initializer = require("../initializer");
var uuid = require('uuid');
var createNamespace = require('continuation-local-storage').createNamespace,
    namespace = createNamespace('org.stellar.stex');
var patchBluebird = require("cls-bluebird");
patchBluebird(namespace);

Initializer.add('startup', 'stex.express', ['stex.config', 'stex.logging', 'stex.db', 'stex.newrelic'], function(stex) {
  var express    = require("express");
  var bodyParser = require('body-parser');
  var cors       = require("cors");
  var urlPattern = require("url-pattern");
  var url        = require("url");
  var _          = require("lodash");

  stex.app    = express();
  stex.router = express.Router();
  global.app  = stex.app;

  app.enable('trust proxy');

  // As part of the spec for CORS, we need to make sure we include
  // Vary: Origin since we're now inspecting the origin to decide
  // whether CORS is allowed or not
  app.use(function(req, res, next) {
    res.vary("Origin");
    next();
  });

  var allowedPatternStrings = stex.conf.get("allowedOrigins") || ["*"];
  var allowedPatterns = _.map(allowedPatternStrings, function(pattern) {
    return urlPattern.newPattern(pattern, '.');
  });

  app.use(cors({
    origin: function(origin, callback){
      if(typeof origin !== 'string') {
        return callback(null, false);
      }

      origin = url.parse(origin).hostname;

      var allowed = _.any(allowedPatterns, function(pattern) {
        return !!pattern.match(origin);
      });

      callback(null, allowed);
    }
  }));


  var bodyLimit = stex.conf.get("bodyLimit") || "128kb";
  var parser    = bodyParser.json({limit: bodyLimit});

  // collect the raw body in to req.rawBody.
  // NOTE: we nest the bodyParser underneath this middleware since this
  // middleware _MUST_ be immediately before bodyParser to work properly
  app.use(function(req, res, next) {
    req.rawBody = '';

    req.on('data', function(chunk) {
      req.rawBody += chunk.toString('utf-8');
    });

    parser(req, res, next);
  });

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
});