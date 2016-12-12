var bristolSyslog = module.exports;

var syslog = require('modern-syslog');

bristolSyslog.makeTarget = function(stex) {
  syslog.init(stex.name, null, syslog.LOG_LOCAL7);

  return function(options, severity, date, message) {
    var syslogSeverity = getSyslogSeverity(severity);
    syslog.log(syslogSeverity, message);
  };
};


function getSyslogSeverity(bristolSeverity) {
  switch(bristolSeverity) {
    case "error": return syslog.level.LOG_ERR;
    case "warn":  return syslog.level.LOG_WARNING;
    case "info":  return syslog.level.LOG_INFO;
    case "debug": return syslog.level.LOG_DEBUG;
    case "trace": return syslog.level.LOG_DEBUG;
    default:      return syslog.level.LOG_INFO;
  }
}
