var Initializer = require("../initializer");
var raven       = require("raven");
var _           = require("lodash");
var domain      = require('domain');


Initializer.add('startup', 'stex.errors', ['stex.initialize-app'], function(stex) {

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

  stex.reportError = function (err) {
    log.error(err);

    if (stex.sentry) {
      stex.sentry.captureError(err);
    }
  }
});


Initializer.add('startup', 'stex.request-domains', ['stex.express', 'stex.logging', 'stex.config'], function(stex) {
  var sentryDsn = conf.get("sentryDsn");
  var sentry = sentryDsn ? new raven.Client(sentryDsn) : null;

  stex.app.use(function (req, res, next) {
    var requestDomain = domain.create();
    var reportErrorDirectly = function(err) {
        stex.reportError;
    };

    requestDomain.on('error', function (err) {
        // if we have started sending a response when the error occurs
        // we can't go through the express error middlewares (since they
        // send a response).
        if(res.headersSent) {
            reportErrorDirectly(err);

            // force the response to be closed, such that we don't leave
            // orphan connections (i.e. headers have been sent, but an error
            // was then raised)
            res.end();
        } else {
            next(err);
        }
    });

    requestDomain.run(next);
  });
});




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

  res.status(response.code).send(response);
}

function cleanStack(plainError) {
  if(typeof plainError.stack === "string") {
    var stackWithoutHeader = plainError.stack.split("\n").splice(1);
    var unindentedStack = _.map(stackWithoutHeader,function(line) {
      return line.substring(4);
    });

    plainError.stack = unindentedStack;
  } else {
    delete plainError.stack;
  }
}
