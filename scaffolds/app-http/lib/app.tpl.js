/**
 * app.js - {{{description}}}
 */

var cantina = require('cantina');

// Create and export the app.
var app = module.exports = cantina.app;

// Attach plugins.
app.use(cantina.plugins.controllers);
app.use(require('cantina-static').plugin);
app.use(require('cantina-views').plugin);

// Views helper.
app.views.helper({
  title: '{{description}}}'
});
