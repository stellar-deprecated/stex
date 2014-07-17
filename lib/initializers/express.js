var Initializer = require("../initializer");
var express     = require("express");
var bodyParser  = require('body-parser');
var cors        = require("cors");


Initializer.add('startup', 'stex.express', ['stex.config', 'stex.logging', 'stex.db'], function(stex) {

  stex.app    = express();
  stex.router = express.Router();
  global.app  = stex.app;

  app.enable('trust proxy')
  app.use(cors());
  app.use(bodyParser.json());

});