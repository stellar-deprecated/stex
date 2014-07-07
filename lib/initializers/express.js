var express     = require("express");
var bodyParser  = require('body-parser');
var cors        = require("cors");
var initializer = module.exports;

initializer.init = function(stex) {
  stex.app    = express();
  stex.router = express.Router();
};

initializer.activate = function(stex) {
  global.app = stex.app;
}

initializer.boot = function(stex) {
  app.enable('trust proxy')
  app.use(cors());
  app.use(bodyParser.json());
}