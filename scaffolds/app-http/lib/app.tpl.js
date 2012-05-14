/**
 * {{description}}}
 */

var cantina = require('cantina');

// Create and export the app.
var app = module.exports = cantina.app;

// Attach plugins.
app.use(cantina.plugins.static);
app.use(cantina.plugins.views);
app.use(cantina.plugins.controllers);

// Views helper.
app.viewHelper({
  title: '{{description}}}'
});
