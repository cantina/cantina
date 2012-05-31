/**
 * cantina.js - Cantina Application Framework
 *
 * A framework for building interconnected applications and services.
 *
 * A cantina app/service is primarily a flatiron http application.  Cantina
 * extends flatiron to use amino as well as providing useful plugins and
 * code structuring conventions.
 */

var flatiron = require('flatiron'),
    path = require('path'),
    pkginfo = require('pkginfo'),
    _app;

var cantina = module.exports = {};

// Expose bundled plugins.
cantina.plugins = flatiron.common.requireDirLazy(path.join(__dirname, 'plugins'));

// Define a getter for cantina.app that creates a new app with default options.
cantina.__defineGetter__('app', function () {
  if (!_app) {
    _app = cantina.createApp();
  }
  return _app;
});

/**
 * Create a cantina application.
 *
 * Params:
 *   - `options`: Application options and info.  Can include:
 *     - `mode`:
 *         Either 'cli' or 'http'(default).
 *     - `amino`:
 *         true(default) or false.
 *     - `name`:
 *         A unique name for your application.  Used as the service name if
 *         this is an amino service.
 *     - `version`:
 *         Should follow the semver standard.
 *     - `root`:
 *         The absolute path to the root directory of the application.
 *         It can normally be  normally autodiscovered.
 *     - `...`:
 *         Other options will be passed through to the http/cli plugin.
 *
 * Returns:
 *   The application object.
 */
cantina.createApp = function(options) {
  var app,
      appPkgInfo = pkginfo.read(module.parent);

  options = options || {};
  app = flatiron.createApp(options);

  // Load the utils plugin.
  app.use(cantina.plugins.utils);

  // Parse the app info from package.json of the parent module.
  app.info = appPkgInfo.package;

  // Default options.
  app.utils.defaults(options, {
    mode: 'http',
    amino: true,
    name: app.info.name || 'cantina-app',
    version: app.info.version || '0.0.1',
  });

  // Merge options into app info.
  app.info.name = options.name;
  app.info.version = options.version;

  // Set the mode so plugins can react accordingly.
  app.mode = options.mode;

  // Set root directory.
  if (options.root) {
    app.root = options.root;
  }
  else {
    app.root = path.dirname(appPkgInfo.dir);
  }

  // Mode-specific setup.
  if (app.mode === 'http') {
    app.use(cantina.plugins.http, options);
    app.use(cantina.plugins.middleware);
  }
  else if (app.mode === 'cli') {
    app.use(flatiron.plugins.cli, options);
  }

  return app;
};
