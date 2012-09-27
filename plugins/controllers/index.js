var app = require('../../')
  , resolve = require('path')

app.conf.add({
  controllers: {
    path: './controllers'
  }
});

app.controllers = [];
app.controller = app.middler;

app.controllers.load = function (dir, parent) {
  dir || (dir = app.conf.get('controllers').path);
  parent || (parent = app.middleware);
  app.utils.glob.sync(dir + '/**.js').forEach(function (file) {
    var controller = require(resolve(__dirname, file));
    if (controller.handler) {
      app.controllers.push(controller);
    }
  });
  app.controllers.forEach(function (controller) {
    parent.add(controller.handler);
  });
};

app.on('ready', function () {
  app.controllers.load();
});