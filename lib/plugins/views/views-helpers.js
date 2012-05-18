/**
 * Expose an api for adding dynamic helpers for binding template data.
 *
 * Helpers can either be an object that will be merged with the other template
 * data, or a function.
 *
 * Helpers will be called in the router scope (this.req, this.res, this.app)
 * during the rendering phase.  Helper funtions accept a callback that should
 * be called with the arguments callback(err, data);
 */

var async = require('flatiron').common.async;

/**
 * Define the plugin.
 */
var helpers = module.exports = {
  name: 'views-helpers',
  description: 'Bind static and dynamic template data for views'
};

// The plugin is being attached to the app.
helpers.attach = function(options) {
  var app = this;
  app.views._helpers = [];

  // Add a views helper.
  app.views.helper = function(helper) {
    app.views._helpers.push(helper);
  };

  // Process views helpers. Called in the router scope.
  app.views.processHelpers = function(templateData, callback) {
    var self = this,
        tasks = [];
    for (var i in app.views._helpers) {
      (function(helper) {
        if (typeof helper === 'function') {
          tasks.push(function(done) {
            helper.call(self, function(err, data) {
              if (data) {
                app.utils.defaults(templateData, data);
              }
              done(err);
            });
          });
        }
        else {
          app.utils.defaults(templateData, helper);
        }
      })(app.views._helpers[i]);
    }
    if (tasks.length) {
      async.parallel(tasks, callback);
    }
    else {
      callback(null);
    }
  };
}
