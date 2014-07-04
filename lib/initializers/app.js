var express = require("express");
var initializer = module.exports;

initializer.boot = function(stex) {
  stex.appInitializer(stex);
  app.use("/", stex.router);
};