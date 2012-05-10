/**
 * Serve static files.
 */

var path = require('path'),
    connect;

// Attempt to require connect.
try {
  connect = require('connect');
}
catch (ex) {
  console.warn('cantina.plugins.static depends on "connect" being installed.');
  console.warn('install using `npm install connect`.');
  process.exit(1);
}

/**
 * Define the plugin.
 */
var static = module.exports = {
  name: 'static',
  description: 'Service static files.'
};

static.attach = function(options) {
  var app = this, dir, middleware;

  options = options || {};
  app.utils.defaults(options, {
    path: 'public',
    maxAge: 0
  });

  if (app.root) {
    dir = path.join(app.root, options.path);
    if (path.existsSync(dir)){
      middleware = connect.static(dir, {maxAge: options.maxAge});
      app.http.before.push(middleware);
    }
    else {
      throw new Error('The specified static directory does not exist: ' + dir);
    }
  }
  else {
    throw new Error('In order to use the static plugin, `app.root` must be defined.');
  }
};