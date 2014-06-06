// Modules dependencies.
var EventEmitter = require('events').EventEmitter
  , etc = require('etc')
  , etcYaml = require('etc-yaml')
  , witwip = require('witwip')
  , path = require('path')
  , glob = require('glob')
  , callerId = require('caller-id')
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
 * Start the application.
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
 * Destroy the app.
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
  var noops = Object.keys(app.log).filter(function (prop) {
    return typeof app.log[prop] === 'function';
  });
  app.log = function () {};
  noops.forEach(function (noop) {
    app.log[noop] = app.log;
  });
};

/**
 * Private registry of 'loaders'.
 */
app._loaders = {};

/**
 * Register a loader.
 */
app.loader = function (type, handler) {
  app._loaders[type] = handler;
};

/**
 * Run a loader.
 *
 * Options:
 *   - parent: The root directory where the target directory is found. Defaults
 *             to the calling function's directory.
 *   - dir: The name of the directory we are loading. Defaults to type.
 */
app.load = function (type, options) {
  if (!app._loaders[type]) throw new Error('Tried to load an unregistered type: ' + type);

  options = options || {};
  if (!options.parent) {
    options.parent = path.dirname(callerId.getData().filePath);
  }
  if (!options.dir) {
    options.dir = type;
  }
  options.path = path.resolve(options.parent, options.dir);

  return app._loaders[type](options);
};

/**
 * Register a 'modules' type loader. Loads .js files in the target directory
 * OR index.js files in nested directories. Returns the required modules.
 */
app.loader('modules', function (options) {
  var modules = {};

  // Load .js files in the directory.
  glob.sync(options.path + '/*.js').forEach(function (p) {
    modules[path.basename(p, '.js')] = require(path.resolve(p));
  });

  // Load index.js files one level down.
  glob.sync(options.path + '/**/index.js').forEach(function (p) {
    modules[path.dirname(p).split('/').pop()] = require(path.resolve(p));
  });

  return modules;
});

/**
 * Registers a plugins loader.
 */
app.loader('plugins', function (options) {
  options = options || {};
  options.dir = options.dir || 'plugins';
  return app.load('modules', options);
});
