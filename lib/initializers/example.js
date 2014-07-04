/*
 * This file represents an example `module`, the building blocks of the stex
 * framework.  Each module contributes various pieces of functionality, such
 * as configuration, logging, or error handling to the overall stex application.
 * 
 * Each module can respond to one or more lifecycle events (defined as methods 
 * below) that allow the module to inject its functionality at the appropriate
 * times.
 * 
 */


var express = require("express");
var initializer = module.exports;

/**
 * The init lifecycle event gets called upon stex app construction.  It is the 
 * earliest lifecycle event.  If it is possible for your module to inject
 * functionality this early it should do so, but try to avoid heavy work or
 * external connections.
 *
 * Most importantly, you should not add anything that requires an explicit 
 * shutdown procedure to clean itself up.
 * 
 * @param  {stex} stex the app
 */
initializer.init = function(stex) {

};

/**
 * Stex applications assume that they are king and can populate a couple of 
 * useful global vars to make your life easier.  Things like a global config
 * object or a global logger.  "Activation" is where your modules add their
 * globals, if any.
 * 
 * @param  {stex} stex the app
 */
initializer.activate = function(stex) {
  
};

/**
 * The most important lifecycle event.  Just prior to starting a server, or a 
 * console, the boot event will be triggered expressing the desire to have a 
 * fully armed and operation stex application.
 *
 * Create database connections here, install express middleware, define routes.
 * 
 * @param  {stex} stex the app
 */
initializer.boot = function(stex) {
  
};

/**
 * Clean up any external connections and release any resources during this
 * lifecycle event 
 * 
 * @param  {stex} stex the app
 */
initializer.shutdown = function(stex) {

};