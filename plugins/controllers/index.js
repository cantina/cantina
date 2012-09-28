var app = require('../../')
  , resolve = require('path').resolve

app.conf.add({
  controllers: {
    path: './controllers'
  }
});

app.controllers = [];
app.controller = app.middler;

app.controllers.load = function (dir, parent) {
  dir || (dir = resolve(app.root, app.conf.get('controllers').path));
  parent || (parent = app.middleware);
  var controllers = [];
  app.utils.glob.sync(dir + '/**/*.js').forEach(function (file) {
    var controller = require(file);
    if (controller.handler) {
      controllers.push(controller);
    }
  });
  if (app.controllers.length) {
    controllers = controllers.concat(app.controllers.splice(0));
  }
  controllers.forEach(function (controller) {
    parent.add(controller.handler);
  });
};

app.on('ready', function () {
  app.controllers.load();
});