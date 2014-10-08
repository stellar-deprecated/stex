var Initializer = require("../initializer");

Initializer.add('startup', 'stex.express', ['stex.config', 'stex.logging', 'stex.db', 'stex.newrelic'], function(stex) {
  var express    = require("express");
  var bodyParser = require('body-parser');
  var cors       = require("cors");
  var minimatch  = require("minimatch");
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

  app.use(cors({
    origin: function(origin, callback){
      if(typeof origin !== 'string') {
        return callback(null, false);
      }

      var allowedPatterns = stex.conf.get("allowedOrigins") || ["*"];

      var allowed = _.any(allowedPatterns, function(pattern) {
        return minimatch(origin, pattern);
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
});