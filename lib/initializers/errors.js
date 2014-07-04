var raven = require("raven");
var _     = require("lodash");

var initializer = module.exports;

initializer.boot = function(stex) {

  /// catch 404 and forwarding to error handler
  stex.app.use(function(req, res, next) {
    res.send(404, {
      "status": "fail",
      "code":   "not_found"
    });
  });

  var sentryDsn = conf.get("sentryDsn");
  if(sentryDsn) {
    stex.app.use(raven.middleware.express(sentryDsn));
  }

  stex.app.use(logError); 
  stex.app.use(renderErrorResponse); 
  
};

function logError(err, req, res, next) {
  var plainError = {};
  Object.getOwnPropertyNames(err).forEach(function(key) {
    plainError[key] = err[key];
  });

  plainError.className = err.constructor.name;
  cleanStack(plainError);

  log.error({
    type: "error",
    error: plainError
  });

  next(err);
}

function renderErrorResponse(err, req, res, next) {
  var response = { 
    status:  'error',
    code:    err.status || 500,
    message: err.message 
  };

  if(conf.get("showStackTraces") === true) {
    response.data = { stack: err.stack };
  }

  res.send(response.code, response);
}

function cleanStack(plainError) {
  if(typeof plainError.stack === "string") {
    var stackWithoutHeader = plainError.stack.split("\n").splice(1);
    var unindentedStack = _.map(stackWithoutHeader,function(line) {
      return line.substring(4);
    })

    plainError.stack = unindentedStack;
  } else {
    delete plainError.stack;
  }
}
