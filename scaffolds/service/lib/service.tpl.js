/**
 * service.js - {{{title}}} application (daemon).
 */

// Module dependencies.
var cantina = require('cantina');

/**
 * Create the {{{title}}} application.
 */
exports.create = function(options) {
  var app;

  options = options || {};
  cantina.plugins.utils.defaults(options, {
    // app options here ...
    {{#unless amino}}amino: false{{/unless}}
  });

  app = cantina.createApp(options);
  return app;
};
