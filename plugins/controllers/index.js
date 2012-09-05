exports.name = 'controllers';

exports.version = require('../../package.json').version;

exports.dependencies = {
  middleware: '~1.0'
};

exports.defaults = {
  path: './controllers'
};

exports.init = function (app, done) {
  var conf = app.conf.get(exports.name);
  app.controllers = [];
  app.controller = app.middler;
  done();
};

exports.ready = function (app, done) {
  app.controllers.forEach(function (controller) {
    app.middleware.add(controller.handler);
  });
  done();
};