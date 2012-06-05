/**
 * Cantina Controllers Plugin
 *
 * @module cantina
 * @exports {Object} The controller plugin.
 * @requires flatiron, path
 */

// Module dependencies.
var path = require('path'),
    flatiron = require('flatiron');

/**
 * The controllers plugin.
 *
 * Loads 'controllers' that can mount routes to a cantina app.
 *
 * Controllers are just broadway plugins, but they also support a 'routes'
 * property that will be automatically mounted.
 *
 * @class cantina.plugins.controllers
 */
var controllers = module.exports = {
  name: 'controllers',
  description: 'Load controllers that can mount routes to a cantina app.'
};

/**
 * Attach the plugin to an application.
 *
 * All .js modules found under `options.path` will be loaded and attached to
 * the app (they are assumed to be plugins).
 *
 * The plugins will also be checked for a `routes` property that will be
 * mounted to the app's router.  The `routes` poperty is a director-style
 * routing table like:
 *
 *     exports.routes = {
 *       '/': {
 *         'get': index // <---- A function that will be called in the router scope.
 *       }
 *     };
 *
 * @method attach
 * @param options {Object} Plugin options.  Can include:
 *
 *   - `path`: Path to the controllers directory, relative to the application
 *             root (app.root).
 */
controllers.attach = function(options) {
  var app = this, dir, controller;

  options = options || {};
  app.utils.defaults(options, {
    path: 'lib/controllers'
  });

  if (!app.root) {
    throw new Error('In order to use the controllers plugin, `app.root` must be defined.');
  }

  dir = path.join(app.root, options.path);

  if (!path.existsSync(dir)){
    throw new Error('The specified controllers directory does not exist: ' + dir);
  }

  // Lazy-load the controllers directory.
  app.controllers = flatiron.common.requireDirLazy(dir);

  // For each controller, load it as a plugin and also look for a `routes`
  // export and mount it.
  for (var name in app.controllers) {
    if (app.controllers.hasOwnProperty(name)) {
      controller = app.controllers[name];
      app.use(controller);
      if (app.router && controller.routes) {
        app.router.mount(controller.routes);
      }
    }
  }
};
