// Modules dependencies.
var EventEmitter = require('events').EventEmitter
  , inherits = require('util').inherits
  , etc = require('etc')
  , etcYaml = require('etc-yaml')
  , witwip = require('witwip')
  , path = require('path')
  , fs = require('fs')
  , resolve = require('resolve')
  , glob = require('glob')
  , _ = require('underscore')
  , callerId = require('caller-id')
  , createHooks = require('stact-hooks');

/**
 * Application constructor.
 */
function Cantina (options) {
  EventEmitter.call(this);

  var app = this;
  options = options || {};

  // Set max listeners.
  app.setMaxListeners(0);

  // Create a hooks stack.
  app.hook = createHooks();

  // Expose basic logging.
  app.log = console.log;
  app.log.error = console.error;
  app.log.info = console.log;
  app.log.warn = console.warn;

  // Cached plugins.
  app._plugins = {};

  // Loaders registry.
  app._loaders = {};

  /**
   * Register a 'modules' type loader. Loads .js files in the target directory
   * OR index.js files in nested directories. Returns the required modules.
   * Respects `module.exports.weight` for each module.
   */
  app.loader('modules', function (options) {
    var app = this
      , modules = [];

    // Find files in the directory.
    glob.sync(options.path + '/*.js').forEach(function (p) {
      modules.push({
        name: path.basename(p, '.js'),
        path: path.resolve(p),
        weight: require(path.resolve(p)).weight || 0
      });
    });

    // Find index.js files one level down.
    glob.sync(options.path + '/**/index.js').forEach(function (p) {
      modules.push({
        name: path.dirname(p).split('/').pop(),
        path: path.resolve(p),
        weight: require(path.resolve(p)).weight || 0
      });
    });

    // Sort by weight.
    modules.sort(function (a, b) {
      return a.weight - b.weight;
    });

    // Load all modules.
    return modules.reduce(function (hash, module) {
      hash[module.name] = app.require(module.path);
      return hash;
    }, {});
  });

  /**
   * Registers a plugins loader.
   */
  app.loader('plugins', function (options) {
    return this.load('modules', options);
  });

  /**
   * Register a configuration loader.
   */
  app.loader('conf', function (options) {
    if (fs.existsSync(path.join(options.parent, 'etc'))) {
      this.conf.etc(path.join(options.parent, 'etc'));
    }
    if (fs.existsSync(path.join(options.parent, 'package.json'))) {
      this.conf.pkg(path.join(options.parent, 'package.json'));
    }
  });
}
inherits(Cantina, EventEmitter);

/**
 * Boot the application.
 */
Cantina.prototype.boot = function (root, callback) {
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
Cantina.prototype.start = function (callback) {
  var app = this;

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
Cantina.prototype.destroy = function (callback) {
  var app = this;

  // Run 'destroy' hooks.
  app.hook('destroy').runSeries(function (err) {
    if (err) return callback(err);

    // Clear the require cache.
    Object.keys(require.cache).forEach(function (key) {
      delete require.cache[key];
    });

    // Clear the plugin cache.
    app._plugins = {};

    callback();
  });
};

/**
 * 'Silence' the app.
 */
Cantina.prototype.silence = function () {
  var app = this;

  var noops = Object.keys(app.log).filter(function (prop) {
    return typeof app.log[prop] === 'function';
  });
  app.log = function () {};
  noops.forEach(function (noop) {
    app.log[noop] = app.log;
  });
};

/**
 * Load a plugin (cached).
 */
Cantina.prototype.require = function (name) {
  var app = this
    , base = path.dirname(callerId.getData().filePath)
    , resolved = resolve.sync(name, {basedir: base});

  if (typeof app._plugins[resolved] === 'undefined') {
    var func = require(resolved);
    app._plugins[resolved] = func(app);
  }

  return app._plugins[resolved];
};


/**
 * Register a loader.
 */
Cantina.prototype.loader = function (type, defaults, handler) {
  var app = this;

  if (typeof handler !== 'function') {
    handler = defaults;
    defaults = {};
  }
  _.defaults(defaults, {
    dir: type
  });

  app._loaders[type] = {
    defaults: defaults,
    handler: handler
  };
};

/**
 * Run a loader.
 *
 * Options:
 *   - parent: The root directory where the target directory is found. Defaults
 *             to the calling function's directory.
 *   - dir: The name of the directory we are loading. Defaults to type.
 */
Cantina.prototype.load = function (type, options) {
  var app = this;

  if (!app._loaders[type]) throw new Error('Tried to load an unregistered type: ' + type);

  // Apply options, loader defaults, and invocation defaults.
  options = _.defaults({}, options, app._loaders[type].defaults, {
    parent: path.dirname(callerId.getData().filePath)
  });

  // Set the path.
  options.path = path.resolve(options.parent, options.dir);

  // Call the loader handler.
  return app._loaders[type].handler.call(this, options);
};

/**
 * Exports.
 */
module.exports = Cantina;
module.exports.createApp = function (options) {
  return new Cantina(options);
};
