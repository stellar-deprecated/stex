var Initializer = require("../initializer");

Initializer.add('startup', 'stex.express', ['stex.config', 'stex.logging', 'stex.db', 'stex.newrelic'], function(stex) {
  var express     = require("express");
  var bodyParser  = require('body-parser');
  var cors        = require("cors");

  stex.app    = express();
  stex.router = express.Router();
  global.app  = stex.app;

  app.enable('trust proxy')
  app.use(cors());

  var bodyLimit = stex.conf.get("bodyLimit") || "128kb";
  app.use(bodyParser.json({limit: bodyLimit}));

});