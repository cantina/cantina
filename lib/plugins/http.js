/**
 * HTTP-specific functionality for cantina apps.
 */

var flatiron = require('flatiron');

// Define the plugin.
var http = module.exports = {
  name: 'http',
  description: 'Provides http-specific functionality for cantina apps'
};

// The plugin is being attached.
http.attach = function(options) {
  var app = this;

  // Use the http plugin.
  app.use(flatiron.plugins.http);

  // TEMPORARY HACK
  // My director pull request was merged, waiting for new npm version.
  // Allow router.attach to be called multiple times.
  var Router = require('../../node_modules/flatiron/node_modules/director').http.Router;
  Router.prototype.attach = function(fn) {
    var self = this;
    this._attaches = this._attaches || [];
    this._attaches.push(fn);
    this._attach = function() {
      if (self._attaches) {
        for (var i in self._attaches) {
          self._attaches[i].call(this);
        }
      }
    }
  }

  // Attach the app object to the director router.
  app.router.attach(function() {
    this.app = app;
  });

  // Set up Amino
  if (options.amino) {
    var amino;

    // Attempt to require amino.
    try {
      amino = require('amino');
    }
    catch (ex) {
      console.warn('cantina.plugins.http depends on "amino" being installed.');
      console.warn('install using `npm install amino`.');
      process.exit(1);
    }

    // Expose amino to the app.
    app.amino = amino;

    // Override app.start() to create an amino service and listen on it.
    app._start = app.start;
    app.start = function(callback) {
      // Create an amno service.
      app.service = amino.createService(app.info.name + '@' + app.info.version);

      // Listen for spec and then startup the http server.
      app.service.on('spec', function(spec) {
        app.spec = spec;
        app._start(spec.port, spec.host, function(err) {
          if (!err) {
            if (!options.silent) {
              app.log.info(flatiron.common.format('Started %s@%s on http://%s:%s', app.info.name, app.info.version, spec.host, spec.port));
            }
          }
          app.emit('started');
          if (callback) callback(err);
        });
      });
    };

    // Stop an amino-powered application, close the service.
    // Hard is optional, but if true, then immediately clear the service
    // from the globalAgent.  Useful for testing.
    app.stop = function(hard, callback) {
      if (typeof hard === 'function') {
        callback = hard;
        hard = false;
      }
      if (hard) {
        app.service.close(function() {
          amino.globalAgent.services[app.info.name] = [];
          callback();
        });
      }
      else {
        app.service.close(callback);
      }
    };
  }
  // Add 'started' event to regular http startup.
  else {
    app._start = app.start;
    app.start = function() {
      app._start.apply(app, arguments);
      app.emit('started');
    }
  }
}
