/**
 * {{title}} application (daemon).
 */

// Module dependencies.
var cantina = require('cantina');

// Create the service application.
exports.create = function(options) {
  var app = cantina.createApp(options);

  options = options || {};

  // Load plugins.  For example:
  app.use(cantina.plugins.controllers);

  return app;
};
