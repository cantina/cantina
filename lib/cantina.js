// Modules dependencies.
var EventEmitter = require('events').EventEmitter,
    etc = require('etc'),
    etcYaml = require('etc-yaml'),
    findPkg = require('witwip'),
    fs = require('fs'),
    path = require('path'),
    existsSync = fs.existsSync || path.existsSync,
    async = require('async'),
    debug = require('debug')('cantina'),
    semver = require('semver'),
    inherits = require('util').inherits;

/**
 * Cantina application class.
 */
function Cantina(conf) {
  this.plugins = {};
  this.services = {};
  this.parent = module.parent.parent;

  try {
    this.pkgPath = findPkg(path.dirname(this.parent.filename));
    this.root = path.dirname(this.pkgPath);
  }
  catch (e) {
    this.pkgPath = null;
    this.root = path.dirname(this.parent.filename);
  }

  // Setup basic conf.
  this.conf = etc().use(etcYaml).argv().env();

  // Add conf.
  if (conf) {
    this.conf.add(conf);
  }

  // Add ./etc of parent.
  this.conf.folder(path.join(this.root, 'etc'));

  // Add package.json of the app.
  if (this.pkgPath) {
    this.conf.pkg(this.pkgPath);
  }

  // Load utils plugin.
  this.use('utils');

  EventEmitter.call(this);
}
inherits(Cantina, EventEmitter);
module.exports = Cantina;

/**
 * Use a plugin.
 */
Cantina.prototype.use = function(plugin, conf) {
  // Load the plugin, if needed.
  if (typeof plugin === 'string') {
    plugin = this.loadPlugin(plugin);
  }

  plugin.version = plugin.version || '0.0.0';

  // Make sure plugin conforms to api.
  this.checkPlugin(plugin);

  // Don't add the same plugin twice.
  if (this.plugins[plugin.name]) {
    throw new Error('Tried using plugin that was already added: ' + plugin.name);
  }

  // Add default conf from plugin.
  if (plugin.defaults) {
    var c = {};
    c[plugin.name] = plugin.defaults;
    this.conf.add(c);
  }

  // Add passed conf.
  if (conf) {
    this.conf.set(plugin.name, conf);
  }

  this.plugins[plugin.name] = plugin;
};

/**
 * Initialize all plugins and call plugin ready functions.
 */
Cantina.prototype.init = function (callback) {
  var app = this, tasks;

  tasks = Object.keys(app.plugins).filter(function (name) {
    if (app.plugins[name].error) app.on('error', app.plugins[name].error.bind(app));
    return !!app.plugins[name].init;
  }).map(function (name) {
    return app.plugins[name].init.bind(app, app);
  }).concat(Object.keys(app.plugins).filter(function (name) {
    return !!app.plugins[name].ready;
  }).map(function (name) {
    return app.plugins[name].ready.bind(app, app);
  }));

  async.series(tasks, function (err) {
    callback(err, app);
    !err && app.emit('ready');
  });
};

/**
 * Resolve a path relative to the app root.
 */
Cantina.prototype.resolve = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this.root);
  return path.resolve.apply(path, args);
};

/**
 * Resolve a path relative to the parent module.
 */
Cantina.prototype.resolveParent = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(path.dirname(this.parent.filename));
  return path.resolve.apply(path, args);
};

/**
 * Load a plugin.
 */
Cantina.prototype.loadPlugin = function(pluginPath) {
  if (typeof pluginPath !== 'string') return pluginPath;

  // Resolve relative path.
  if (pluginPath.indexOf('.') === 0) {
    pluginPath = this.resolveParent(pluginPath);
  }

  // Check if this is a core plugin.
  if (existsSync(path.join(__dirname, '../plugins', pluginPath))) {
    pluginPath = path.join(__dirname, '../plugins', pluginPath);
  }

  // Load the plugin.
  var plugin = this.parent.require(pluginPath);

  // Merge info from plugin's package.json.
  try {
    var pkgPath = findPkg(path.dirname(this.parent.filename), pluginPath);
    if (pkgPath) {
      var info = require(pkgPath);
      if (info.name && !plugin.name) {
        plugin.name = info.name;
      }
      if (info.version && !plugin.version) {
        plugin.version = info.version;
      }
    }
  }
  catch (e) {
    // We don't care about plugins with no package.json.
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  return plugin;
};

/**
 * Ensure a plugin conforms to the minimum api and its dependencies have already
 * been added to the app.
 */
Cantina.prototype.checkPlugin = function(plugin) {
  var app = this;

  if (!plugin.name) {
    throw new Error('Plugin "' + JSON.stringify(plugin) + '" must have a `name`');
  }
  if (!plugin.init || (typeof plugin.init !== 'function')) {
    throw new Error('Plugin "' + plugin.name + '" must have an `init()` method');
  }

  if (plugin.dependencies) {
    Object.keys(plugin.dependencies).forEach(function(name) {
      if (!app.plugins[name]) {
        throw new Error('Plugin dependency `' + name + '` missing for `' + plugin.name);
      }
      if (!semver.satisfies(app.plugins[name].version, plugin.dependencies[name])) {
        throw new Error('Plugin dependency `' + name + '` is the wrong version');
      }
    });
  }
};
