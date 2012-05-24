/**
 * {{{description}}}
 */

var cantina = require('cantina'),
    controllers = require('cantina-controllers'),
    static = require('cantina-static'),
    views = require('cantina-views');

// Create and export the app.
var app = module.exports = cantina.app;

// Attach plugins.
app.use(controllers);
app.use(static);
app.use(views);

// Views helper.
app.views.helper({
  title: '{{description}}}'
});
