/**
 * Provides a simple system for discovering and rendering views.
 *
 * Templates are rendered with consolidate.js (Express 3.0's template engine).
 */

var path = require('path'),
    async = require('flatiron').common.async,
    cons;

// Attempt to require consolidate.
try {
  cons = require('consolidate');
}
catch (ex) {
  console.warn('cantina.plugins.views depends on "consolidate" being installed.');
  console.warn('install using `npm install consolidate`.');
  process.exit(1);
}

/**
 * Define the plugin.
 */
var views = module.exports = {
  name: 'views',
  description: 'Discover and render views'
};

/**
 * The plugin is being attached, add the views functionality to the app.
 */
views.attach = function(options) {
  var app = this;
  app.views = app.views || {};

  options = options || {};
  app.utils.defaults(options, {
    path: 'lib/views',
    layout: 'layout',
    ext: 'hbs',
    engine: 'handlebars'
  });

  // Make sure the layout exists.
  if (!path.existsSync(path.resolve(app.root, options.path, options.layout + '.' + options.ext))) {
    options.layout = false;
  }

  // Views helpers.
  //
  // Expose an api for adding dynamic helpers for setting template variables.
  //
  // Helper can either be an object that will be merged with the other template
  // data, or a function.
  //
  // These functions will be invoked with the router scope (req, res, app)
  // during the rendering phase.  Helper funtions accept a callback that should
  // be called with the arguments callback(err, data);
  app.views.helpers = [];
  app.viewHelper = function(helper) {
    app.views.helpers.push(helper);
  };

  // Render views.
  //
  // `view` should be the path to a template, relative to options.dir and
  // excluding the extension.
  // `opts` can contain template data or engine-specific options.
  // `cb` is optional, the template output as html by default.
  function render(view, opts, cb) {
    var self = this,
        opts = opts || {},
        res = this.res,
        app = this.app,
        template,
        tasks = [];

    // Support callback function as second argument.
    if (typeof opts === 'function') {
      cb = opts, opts = {};
    }

    // If opts is a string, assign it to opts.content.
    if (typeof opts === 'string') {
      opts = {content: opts};
    }

    // Merge in application default options.
    app.utils.defaults(opts, options);

    // Default render callback.
    cb = cb || function(err, str) {
      // If we have a layout, and this is not the layout, render this
      // content inside the layout.
      if (opts.layout && view !== opts.layout) {
        self.render(opts.layout, str);
      }
      else {
        res.html(str);
      }
    };

    // Process view helpers and merge with opts.
    for (var i in app.views.helpers) {
      if (typeof app.views.helpers[i] === 'function') {
        (function(helper) {
          tasks.push(function(done) {
            helper.call(self, function(err, data) {
              if (data) {
                app.utils.defaults(opts, data);
              }
              done(err);
            });
          });
        })(app.views.helpers[i]);
      }
      else{
        app.utils.defaults(opts, app.views.helpers[i]);
      }
    }
    // Render the view with consolidate after processing view helpers.
    async.parallel(tasks, function(err) {
      template = path.resolve(app.root, opts.path, view) + '.' + opts.ext
      cons[opts.engine](template, opts, cb);
    });
  }

  // Attach the render function.
  if (app.router) {
    app.router.attach(function() {
      this.render = render.bind(this);
    });
  }
};
