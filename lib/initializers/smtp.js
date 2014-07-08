var nodemailer  = require("nodemailer");
var initializer = module.exports;


initializer.init = function(stex) {
  var smtpConf = conf.get("smtp");
  if(smtpConf) {
    stex.smtp = nodemailer.createTransport("SMTP",smtpConf);
  }
};

initializer.activate = function(stex) {
  global.smtp = stex.smtp;
}

initializer.shutdown = function(stex) {
  if(stex.smtp) {
    stex.smtp.close();
  }
}