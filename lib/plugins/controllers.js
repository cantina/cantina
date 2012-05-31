/**
 * controllers.js - Cantina Controllers Plugin
 *
 * Load 'controllers' that can mount routes to a cantina app.
 *
 * Controllers are just broadway plugins, but they also support a 'routes'
 * property that will be automatically mounted.
 */

var path = require('path'),
    flatiron = require('flatiron');

// Define the plugin.
var controllers = module.exports = {
  name: 'controllers',
  description: 'Load controllers that can mount routes to a cantina app.'
};

/**
 * Attach the plugin to an application.
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
