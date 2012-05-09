/**
 * Load 'controllers' that can mount routes to a cantina app.
 *
 * Controllers are just broadway plugins, but they also support a 'routes'
 * property that will be automatically mounted.
 */

var path = require('path'),
    flatiron = require('flatiron');

/**
 * Define the plugin.
 */
var controllers = module.exports = {
  name: 'controllers',
  description: 'Load controllers that can mount routes to a cantina app.'
};

controllers.attach = function(options) {
  var app = this, dir, controller;

  options = options || {};
  options.path = options.path || 'controllers';

  if (app.root) {
    dir = path.join(app.root, options.path);
    if (path.existsSync(dir)){
      app.controllers = flatiron.common.requireDirLazy(dir);
      for (var name in app.controllers) {
        if (app.controllers.hasOwnProperty(name)) {
          controller = app.controllers[name];
          app.use(controller);
          if (controller.routes) {
            app.router.mount(controller.routes);
          }
        }
      }
    }
    else {
      throw new Error('The specified controllers directory does not exist: ' + dir);
    }
  }
  else {
    throw new Error('In order to use the controllers plugin, `app.root` must be defined.');
  }
}
