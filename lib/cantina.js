/**
 * Cantina
 *
 * A framework for building interconnected applications and services.
 *
 * A cantina app/service is primarily a flatiron http application.  Cantina
 * extends flatiron to use amino as well as providing useful plugins and
 * code structuring conventions.
 */

var flatiron = require('flatiron'),
    amino = require('amino'),
    path = require('path'),
    pkginfo = require('pkginfo').read(module.parent),
    _app;

var cantina = module.exports = {};

// Expose bundled plugins.
cantina.plugins = flatiron.common.requireDirLazy(path.join(__dirname, 'plugins'));

// Define a getter for cantina.app that creates a new app with empty options.
cantina.__defineGetter__('app', function () {
  if (!_app) {
    _app = cantina.createApp();
  }
  return _app;
});

// Augment a flatiron app and return it.
cantina.createApp = function(options) {
  var app;

  options = options || {};
  app = flatiron.createApp(options);

  // Setup the app info.
  app.info = pkginfo.package;
  if (options.name) app.info.name = options.name;
  if (options.version) app.info.version = options.version;

  // Set root directory.
  app.root = path.dirname(pkginfo.dir);
  if (options.root) app.root = options.root;

  // Use the http plugin.
  app.use(flatiron.plugins.http);

  // TEMPORARY HACK
  // Trying to get a patch landed to handle this.
  // Allow router.attach to be called multiple times.
  if (app.router) {
    var Router = require('../node_modules/flatiron/node_modules/director').http.Router;
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
  }

  // Attach the app object to the director router.
  if (app.router) {
    app.router.attach(function() {
      this.app = app;
    });
  }

  // Load the utils plugin.
  app.use(cantina.plugins.utils);

  // Start up the application wih amino.
  app._start = app.start;
  app.start = function(callback) {
    // Create an amno service.
    var service = amino.createService(app.info.name + '@' + app.info.version);

    // Listen for spec and then startup the http server.
    service.on('spec', function(spec) {
      app._start(spec.port, spec.host, function(err) {
        if (!err) {
          if (!options.silent) {
            app.log.info(flatiron.common.format('Started %s@%s on http://%s:%s', app.info.name, app.info.version, spec.host, spec.port));
          }
        }
        if (callback) callback(err);
      });
    });
  };

  return app;
};
