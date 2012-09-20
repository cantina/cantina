var app = require('../../');

app.conf.add({
  controllers: {
    path: './controllers'
  }
});

app.on('init', function () {
  app.controllers = [];
  app.controller = app.middler;
});

app.on('ready', function () {
  app.controllers.forEach(function (controller) {
    app.middleware.add(controller.handler);
  });
});
