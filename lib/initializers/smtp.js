var Initializer = require("../initializer");
var nodemailer  = require("nodemailer");
var path        = require('path');
var mkdirp      = require("mkdirp");
var Promise     = require("bluebird");


Initializer.add('startup', 'stex.smtp', ['stex.config'], function(stex) {
  var smtpConf = stex.conf.get("smtp");

  if(smtpConf) {
    stex.smtp = nodemailer.createTransport("SMTP",smtpConf);
  } else {
    //ensure the path exists
    var emailPath = path.join(stex.root, "tmp", "smtp");
    mkdirp.sync(emailPath)
    stex.smtp = nodemailer.createTransport("PICKUP", emailPath);
  }

  stex.smtp.sendMailAsync = Promise.promisify(stex.smtp.sendMail);

  global.smtp = stex.smtp;
});

Initializer.add('shutdown', 'stex.smtp', function(stex) {
  if(stex.smtp) {
    stex.smtp.close();
  }
});