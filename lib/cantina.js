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
    util = require('util'),
    pkginfo = require('pkginfo').read(module.parent),
    app = flatiron.app;

var cantina = module.exports = {};

// Expose bundled plugins.
cantina.plugins = flatiron.common.requireDirLazy(path.join(__dirname, 'plugins'));

// Take options and return the app.
cantina.app = function(options) {
  options = options || {};

  // Setup the app info.
  app.info = pkginfo.package;
  if (options.name) app.info.name = options.name;
  if (options.version) app.info.version = options.version;

  // Set root directory.
  app.root = path.dirname(pkginfo.dir);
  if (options.root) app.root = options.root;

  // Use the http plugin.
  app.use(flatiron.plugins.http);

  // Start up the application wih amino.
  app._start = app.start;
  app.start = function() {
    // Create an amno service.
    var service = amino.createService(app.info.name + '@' + app.info.version);

    // Listen for spec and then startup the http server.
    service.on('spec', function(spec) {
      app._start(spec.port, spec.host, function(err) {
        if (err) throw err;
        app.log.info(util.format('Started %s@%s on http://%s:%s', app.info.name, app.info.version, spec.host, spec.port));
      });
    });
  };

  return app;
};
