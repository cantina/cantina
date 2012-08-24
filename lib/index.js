var path = require('path');

// Expose Cantina class.
exports.Cantina = require('./cantina');

/**
 * Create an application with a set of plugins.
 */
exports.createApp = function(plugins, conf, callback) {
  var app;

  if (typeof conf === 'function') {
    callback = conf;
    conf = {};
  }

  // Create the app.
  app = new exports.Cantina(conf);

  // Add plugins.
  plugins.forEach(function(plugin) {
    app.use(app.loadPlugin(plugin, module.parent));
  });

  // Initialize app.
  app.init();

  // If a callback was passed, set up listeners for it.
  if (callback) {
    function done() {
      callback(null, app);
    }
    app.on('ready', done);
    app.on('error', function(err) {
      app.removeListener('ready', done);
      app.destroy();
      callback(err, app);
    });
  }

  return app;
};
