// Modules dependencies.
var EventEmitter = require('events').EventEmitter
  , etc = require('etc')
  , etcYaml = require('etc-yaml')
  , witwip = require('witwip')
  , path = require('path')
  , glob = require('glob')
  , createHooks = require('stact-hooks');

/**
 * Create and export the app object.
 */
var app = module.exports = new EventEmitter();

// Set max listeners.
app.setMaxListeners(0);

// Create a hooks stack.
app.hook = createHooks();

// Expose basic logging.
app.log = console.log;
app.log.error = console.error;
app.log.info = console.log;
app.log.warn = console.warn;

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
  app.hook('start').runSeries(function (err) {
    if (err) return callback(err);
    app.hook('started').run(callback);
  });
};

/**
 * Helper to load modules from a directory.
 */
app.load = function (dir, cwd) {
  var modules = {};

  cwd = cwd || app.root;

  // Load .js files in the directory.
  glob.sync(dir + '/*.js', {cwd: cwd}).forEach(function (p) {
    modules[path.basename(p, '.js')] = require(path.resolve(cwd, p));
  });

  // Load index.js files one level down.
  glob.sync(dir + '/**/index.js', {cwd: cwd}).forEach(function (p) {
    modules[path.dirname(p).split('/').pop()] = require(path.resolve(cwd, p));
  });

  return modules;
};

/**
 * Helper to destroy the app.
 */
app.destroy = function (callback) {
  // Run 'destroy' hooks.
  app.hook('destroy').runSeries(function (err) {
    if (err) return callback(err);

    // Clear the require cache.
    Object.keys(require.cache).forEach(function (key) {
      delete require.cache[key];
    });

    callback();
  });
};

/**
 * 'Silence' the app.
 */
app.silence = function () {
  app.log = function () {};
  app.log.error = app.log;
  app.log.info = app.log;
  app.log.warn = app.log;
};

