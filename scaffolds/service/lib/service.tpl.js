/**
 * service.js - {{{title}}} application (daemon).
 */

// Module dependencies.
var cantina = require('cantina');

/**
 * Create the {{{title}}} application.
 */
exports.create = function(options) {
  var app = cantina.createApp(options);

  options = options || {};

  return app;
};
