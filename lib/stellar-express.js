var express    = require("express");
var bodyParser = require('body-parser');
var cors       = require("cors");


var stellarExpress = function(root, appInitializer) {
  var app = global.app = express();
  app.root = root

  app.use(cors());
  app.use(bodyParser.json());
  require("./initializers/config")(app);
  require("./initializers/logging")(app);
  require("./initializers/db")(app);


  if(appInitializer) {
    appInitializer(app);
  }

  // install routes
  var router = express.Router();
  require(app.root + "/lib/app-routes")(router)

  app.use("/", router);

  require("./initializers/errors")(app);


  return app;
};


// add framework facilities

stellarExpress.errors  = require("./util/errors");
stellarExpress.Promise = require("bluebird");
stellarExpress._       = require("lodash");

module.exports = stellarExpress;
