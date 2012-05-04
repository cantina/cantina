/**
 * Cantina: App
 */

var Service = require('../../cantina-service'),
    path = require('path');

var app = new Service({name: 'app', root: path.resolve(__dirname, '../')});

app.use(Service.plugins.router);

app.init(function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Started app service');
  }
});

module.exports = app;
