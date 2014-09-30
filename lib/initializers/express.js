var Initializer = require("../initializer");

Initializer.add('startup', 'stex.express', ['stex.config', 'stex.logging', 'stex.db', 'stex.newrelic'], function(stex) {
  var express     = require("express");
  var bodyParser  = require('body-parser');
  var cors        = require("cors");

  stex.app    = express();
  stex.router = express.Router();
  global.app  = stex.app;

  app.enable('trust proxy');
  app.use(cors());

  var bodyLimit = stex.conf.get("bodyLimit") || "128kb";
  var parser    = bodyParser.json({limit: bodyLimit});

  // collect the raw body in to req.rawBody.
  // NOTE: we nest the bodyParser underneath this middleware since this 
  // middleware _MUST_ be immediately before bodyParser to work properly
  app.use(function(req, res, next) {
    req.rawBody = '';

    req.on('data', function(chunk) { 
      req.rawBody += chunk.toString('utf-8');
      console.log(req.rawBody.length / 1024.0);
    });

    parser(req, res, next);
  });
});