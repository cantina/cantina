var app = require('../../')
  , resolve = require('path')

app.conf.add({
  controllers: {
    path: './controllers'
  }
});

app.controllers = [];
app.controller = app.middler;

app.controllers.load = function (dir, done) {
  dir || (dir = app.conf.get('controllers').path);
  app.utils.glob(dir + '/**.js')
    .on('match', function (file) {
      var controller = require(resolve(__dirname, file));
      if (controller.handler) {
        app.controllers.push(controller);
      }
    })
    .once('error', done)
    .once('end', function () {
      app.controllers.forEach(function (controller) {
        app.middleware.add(controller.handler);
      });
      done();
    });
};

app.on('ready', function (done) {
  app.controllers.load(null, done);
});