var humanizer = module.exports;
var http      = require('http');
var _         = require('lodash');

var typeProcessors = {};
typeProcessors.message = function(data) {
  return data.message + extraData(data);
};

typeProcessors.request = function(data) {
  var requestLine = data.method + " " + data.url + extraData(data);
  var bodyJson    = JSON.stringify(data.body, null, 2);
  return requestLine + "\n" + bodyJson;
};

typeProcessors.response = function(data) {
  var statusText = http.STATUS_CODES[data.status] + extraData(data);

  return data.status + " " + statusText + " (" + data.duration.toFixed(3) + "ms)";
};

typeProcessors.error = function(data) {
  var initialLine = data.error.className + ": " + data.error.message + extraData(data);
  var stackLines  = _.map(data.error.stack, function(line) {
                      return "  " + line;
                    }).join("\n");
  return initialLine + "\n" + stackLines;
};

typeProcessors.query = function(data) {
  //TODO: figure out how to get timing info from knex
  return "SQL: " + data.sql + extraData(data);
};

humanizer.target = function(options, severity, date, message) {
  process.stdout.write(humanizer.processLine(message));
};

humanizer.processLine = function(line) {
  try {
    var data      = JSON.parse(line);
    var type      = data.type || 'message';
    var processor = typeProcessors[type] || defaultProcessor;

    return processor(data) + '\n';
  } catch (e) {
    return 'LOGERROR: Cannot humanize "' + line + '"\n';
  }
};

function extraData(data) {
  var extras = "";
  if (data.timestamp) {
    extras += " timestamp: " + data.timestamp;
  }
  if (data.date) {
    extras += " date: " + data.date;
  }
  if (data.requestId) {
    extras += " requestId: " + data.requestId;
  }
  return extras;
}

function defaultProcessor(data) {
  return JSON.stringify(data, null, 2);
}