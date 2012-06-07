/**
 * Cantina Application Framework
 * -----------------------------
 *
 * A framework for building interconnected applications and services.
 *
 * A cantina app/service is primarily a flatiron http application.  Cantina
 * extends flatiron to (optionally) use amino as well as providing useful
 * plugins and code structuring conventions.
 *
 * @module cantina
 * @main cantina
 * @exports {Object} The cantina app-creation api.
 * @requires flatiron, path, pkginfo, [amino], [union]
 */

// Module dependencies.
var flatiron = require('flatiron'),
    path = require('path'),
    pkginfo = require('pkginfo'),
    _app;

/**
 * Cantina API
 * -----------
 *
 * Create applications, attach plugins, and start up services.
 *
 * ###Example:###
 *
 *     var cantina = require('cantina');
 *
 *     var app = cantina.createApp({
 *       name: 'my-app',
 *       version: '0.1.0',
 *       mode: 'http',
 *       amino: false,
 *       host: 'localhost',
 *       port: 8080
 *     });
 *
 *     app.router.get('/', function() {
 *       this.res.end('Hello, world!')
 *     });
 *
 *     app.start();
 *
 * @class cantina
 */
var cantina = module.exports = {};

/**
 * Lazy-loaded modules in `lib/plugins` that can be attached to cantina apps.
 *
 * Use like:
 *
 *     app.use('controllers', { [options] });
 *
 * @property plugins
 * @type {Object}
 */
cantina.plugins = flatiron.common.requireDirLazy(path.join(__dirname, 'plugins'));

/**
 * The utils plugin exposed here for convenience.
 *
 * @property utils
 * @type {Object}
 */
cantina.utils = cantina.plugins.utils;

/**
 * Getter for `cantina.app`.
 *
 * Creates an instance of a new application with the default options and caches
 * it for future references.
 *
 * @property app
 * @type {Object}
 */
cantina.__defineGetter__('app', function () {
  if (!_app) {
    _app = cantina.createApp();
  }
  return _app;
});

/**
 * Create a cantina application.
 *
 * @method createApp
 * @param options {Object} Application options and info. Can include:
 *
 *   - `mode`   : Either 'cli' or 'http'(default).
 *   - `amino`  : true(default) or false.
 *   - `name`   : A unique name for your application.  Used as the service name
 *                  if this is an amino service.
 *   - `version`: Should follow the semver standard.
 *   - `root`   : The absolute path to the root directory of the application.
 *                  It can normally be  normally autodiscovered.
 *   - `...`    : Other options will be passed through to the http/cli plugin.
 *
 * @return {Object} The application object.
 */
cantina.createApp = function(options) {
  var app,
      appPkgInfo = pkginfo.read(module.parent);

  options = options || {};
  app = flatiron.createApp(options);

  // Expose the parent module's require.
  app.require = module.parent.require.bind(module.parent);

  // Load the plugins plugin.
  app.use(cantina.plugins.plugins, {cantina: cantina});

  // Load the utils plugin.
  app.use('utils');

  // Parse the app info from package.json of the parent module.
  app.info = appPkgInfo.package;

  // Default options.
  app.utils.defaults(options, {
    mode: 'http',
    amino: true,
    name: app.info.name || 'cantina-app',
    version: app.info.version || '0.0.1'
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
    app.use('http', options);
    app.use('middleware');
  }
  else if (app.mode === 'cli') {
    app.version = app.info.version;
    app.use(flatiron.plugins.cli, options);
  }

  return app;
};
