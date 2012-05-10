/**
 * Provides a simple system for discovering and rendering views.
 *
 * Templates are rendered with consolidate.js (Express 3.0's template engine).
 */

var path = require('path'),
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

  options = options || {};
  app.utils.defaults(options, {
    dir: 'lib/views',
    layout: 'layout',
    ext: 'hbs',
    engine: 'handlebars'
  });

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
        data;

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

    // Default render callback, respond with the html.
    cb = cb || function(err, str) {
      res.html(str);
    };

    // Render the view with consolidate.
    template = path.join(opts.dir, view) + '.' + opts.ext
    cons[opts.engine](template, opts, cb);
  }

  // Attach the render function.
  if (app.router) {
    app.router.attach(function() {
      this.render = render;
    });
  }
};
