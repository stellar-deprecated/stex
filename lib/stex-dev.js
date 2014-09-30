var StexDev = module.exports;
var Stex = require("./stex");

StexDev.Stex = Stex;

StexDev.gulp             = require("./dev/gulp");
StexDev.gulpPlugins      = require("./dev/gulp-plugins");

StexDev.paths = {
  "docs":  ['./lib/**/*.js', './README.md'],
  "lint":  ['./gulpfile.js', './lib/**/*.js', './config/**/*.js', './migrations/**/*.js'],
  "watch": ['./gulpfile.js', './lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  "tests": ['./test/**/*.js', '!test/{temp,temp,support/**}']
};