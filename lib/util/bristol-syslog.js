var bristolSyslog = module.exports;

var syslog = require('node-syslog');

bristolSyslog.makeTarget = function(stex) {
  syslog.init(stex.name, null, syslog.LOG_LOCAL7);

  return function(options, severity, date, message) {
    var syslogSeverity = getSyslogSeverity(severity);
    syslog.log(syslogSeverity, message);
  };
};


function getSyslogSeverity(bristolSeverity) {
  switch(bristolSeverity) {
    case "error": return syslog.LOG_ERR;
    case "warn":  return syslog.LOG_WARNING;
    case "info":  return syslog.LOG_INFO;
    case "debug": return syslog.LOG_DEBUG;
    case "trace": return syslog.LOG_DEBUG;
    default:      return syslog.LOG_INFO;
  }
}