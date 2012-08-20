// Expose Cantina class.
exports.Cantina = require('./cantina');

/**
 * Create an application.
 */
exports.createApp = function(options, callback) {
  var app = new exports.Cantina();
  options = options || {};

  app.init();

  if (callback) {
    app.on('ready', done);
    app.on('error', function(err) {
      app.removeListener('ready', done);
      app.destroy();
      callback(err, app);
    });
  }

  function done() {
    done(null, app);
  }

  return app;
};
