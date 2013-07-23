// Modules dependencies.
var EventEmitter = require('events').EventEmitter
  , etc = require('etc')
  , etcYaml = require('etc-yaml')
  , witwip = require('witwip')
  , path = require('path')
  , inherits = require('util').inherits
  , glob = require('glob')
  , createHooks = require('stact-hooks');

/**
 * Create and export the app object.
 */
var app = module.exports = new EventEmitter();

// Set max listeners.
app.setMaxListeners(0);

// Create a hooks stack.
app.hooks = createHooks();

/**
 * Boot the application.
 */
app.boot = function (root, callback) {
  var app = this;

  app.conf = etc().use(etcYaml).argv().env();

  if (typeof root === 'function') {
    callback = root;
    root = null;
  }

  function setup (err, pkgPath, pkgData) {
    if (err) return callback(err);

    // Set pkg and root paths.
    app.pkgPath = pkgPath;
    app.pkgData = pkgData;
    app.root = path.dirname(pkgPath);

    // Add ./etc of parent.
    app.conf.folder(path.join(app.root, 'etc'));

    // Add package.json of the app.
    app.conf.pkg(app.pkgPath);

    callback();
  }

  if (root) {
    witwip(root, setup);
  }
  else {
    witwip(path.dirname(module.parent.filename), setup);
  }
};

/**
 * 'Start' the application.
 */
app.start = function (callback) {
  callback = callback || function startCallback (err) {
    if (!err) return;
    app.emit('error', err);
  };

  // Run 'start' and 'started' hooks.
  app.hooks('start').runSeries(function (err) {
    if (err) return callback(err);
    app.hooks('started').run(callback);
  });
};

/**
 * Helper to load 'plugins' from a directory.
 */
app.load = function (dir, cwd) {
  cwd = cwd || app.root;

  // Load .js files in the directory.
  glob.sync(dir + '/*.js', {cwd: cwd}).forEach(function (p) {
    require(path.resolve(cwd, p));
  });

  // Load index.js files one level down.
  glob.sync(dir + '/**/index.js', {cwd: cwd}).forEach(function (p) {
    require(path.resolve(cwd, p));
  });
};

/**
 * Helper to destroy the app.
 */
app.destroy = function (callback) {
  // Run 'destroy' hooks.
  app.hooks('destroy').runSeries(function (err) {
    if (err) return callback(err);

    // Clear the require cache.
    Object.keys(require.cache).forEach(function (key) {
      delete require.cache[key];
    });

    callback();
  });
};

