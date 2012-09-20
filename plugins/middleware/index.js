var app = require('../../'),
    middler = require('middler');

app.on('init', function () {
  app.middler = middler;
  app.middleware = app.middler(app.http);
});
