/**
 * {{title}} application (daemon).
 */

// Module dependencies.
var cantina = require('cantina');

// Create the service application.
var app = module.exports = cantina.app;

// Load plugins.  For example:
app.use(cantina.plugins.controllers);
