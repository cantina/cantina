/**
 * {{{description}}}
 */

var cantina = require('cantina');

// Create and export the app.
var app = module.exports = cantina.createApp({
  // app options here ...
  {{#unless amino}}amino: false{{/unless}}
});

// Attach plugins.
app.use('controllers');
app.use('static');
app.use('views');

// Views helper.
app.views.helper({
  title: '{{description}}}'
});
