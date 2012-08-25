var cantina = require('cantina');
var plugins = ['cantina-http', 'cantina-middler', 'cantina-buffet'];

cantina.createApp(plugins, function(err, app) {
  if (err) return console.log(err);

  // You could do stuff here if you want, but it would be better to put
  // functionality in plugins.
});