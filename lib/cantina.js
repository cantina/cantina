// Modules dependencies.
var EventEmitter = require('events').EventEmitter,
    etc = require('etc'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    inherits = require('inherits'),
    debug = require('debug')('cantina'),
    _ = require('underscore');

/**
 * Cantina application class.
 */
function Cantina(options) {
  this.plugins = {};
  this.services = {};
  this.conf = etc().argv().env();

  // Add options.
  if (options) {
    this.conf.add(options);
  }

  // Add ./etc of parent.
  this.conf.folder(path.join(path.dirname(module.parent.filename), 'etc'));

  // Add package.json of parent.
  this.conf.pkg(module.parent);
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
  plugin.initialized = false;

  // Make sure plugin conforms to api.
  this.checkPlugin(plugin);

  // Don't add the same plugin twice.
  if (this.plugins[plugin.name]) {
    throw new Error('Tried using plugin that was already added: ' + plugin.name);
  }

  // Add default conf from plugin.
  if (plugin.conf) {
    var c = {};
    c[plugin.name] = plugin.conf;
    this.conf.add(c);
  }

  // Add passed conf.
  if (conf) {
    this.conf.set(plugin.name, conf);
  }

  this.plugins[plugin.name] = plugin;
};

/**
 * Remove a plugin.
 */
Cantina.prototype.remove = function(name) {
  delete this.plugins[name];
  // TODO Ideally should probably remove plugin services, but then it
  // would have to remove all dependeny plugins as well.
};

/**
 * Start all plugins and emit 'ready'.
 */
Cantina.prototype.init = function() {
  var app = this,
      tasks = [];

  // Give the caller some time to subscribe to the 'ready' event.
  process.nextTick(function() {
    app.sortedPlugins().forEach(function(plugin) {
      tasks.push(function(done) {
        app.initPlugin(plugin, done);
      });
    });

    async.series(tasks, function(err) {
      if (err) return app.emit('error', err, app);
      return app.emit('ready', app);
    });
  });
};

/**
 * Initialize a plugin.
 */
Cantina.prototype.initPlugin = function(plugin, done) {
  var app = this;

  // Don't reinitialize plugins.
  if (plugin.initialized) return done();

  // Gather services that this plugin consumes.
  var imports = {};
  if (plugin.consumes) {
    plugin.consumes.forEach(function(name) {
      imports[name] = app.services[name];
    });
  }

  // Initialize the plugin.
  plugin.init(app.conf.get(plugin.name), imports, function(err, provided) {
    // Bind plugin event handlers.
    var events = ['ready', 'destroy', 'error'];
    events.forEach(function(evt) {
      if (plugin.hasOwnProperty(evt)) {
        app.on(evt, plugin[evt]);
      }
    });

    if (err) return done(err);

    // Confirm that the plugin provides the correct services.
    if (plugin.provides) {
      plugin.provides.forEach(function(name) {
        if (!provided.hasOwnProperty(name)) {
          return done(new Error('Plugin failed to provide ' + name + ' service.  ' + JSON.stringify(plugin)));
        }
        app.services[name] = provided[name];
        app.emit('service', name);
      });
    }

    // The plugin is initialized.
    plugin.initialized = true;
    app.emit('plugin', plugin);
    done();
  });
};

/**
 * Load a plugin.
 */
Cantina.prototype.loadPlugin = function(pluginPath, parent) {
  if (typeof pluginPath !== 'string') return pluginPath;
  parent = parent || module.parent;

  // Resolve relative path.
  if (pluginPath.indexOf('./') === 0) {
    pluginPath = path.resolve(path.dirname(parent.filename), pluginPath);
  }

  // Load the plugin.
  var plugin = parent.require(pluginPath);

  // Support for plugins that export their init function.
  if (typeof plugin === 'function') {
    plugin = {
      init: plugin
    };
  }

  // Merge info from plugin's package.json.
  var pkgPath = findPackage(require.resolve(pluginPath));
  if (pkgPath) {
    var info = require(pkgPath);
    if (!plugin.name && info.name) {
      plugin.name = info.name;
    }
    if (!plugin.version && info.version) {
      plugin.version = info.version;
    }
    if (info.cantina) {
      Object.keys(info.cantina).forEach(function(key) {
        if (!plugin[key]) {
          plugin[key] = info.cantina[key];
        }
      });
    }
  }

  return plugin;
};

/**
 * Destroy and app and its plugins.
 */
Cantina.prototype.destroy = function() {
  app.emit('destroy', app);
};

/**
 * Returns the application plugins, sorted based on dependencies.
 */
Cantina.prototype.sortedPlugins = function() {
  var app = this,
      plugins = [],
      sorted = [],
      changed = true,
      resolved = {};

  // Copy relavent plugin meta-data.
  Object.keys(app.plugins).forEach(function(name) {
    var plugin = app.plugins[name];
    plugins.push({
      name: name,
      provides: plugin.provides ? plugin.provides.concat() : [],
      consumes: plugin.consumes ? plugin.consumes.concat() : []
    });
  });

  // Sort the plugins.
  while(plugins.length && changed) {
    changed = false;
    plugins.concat().forEach(function(plugin) {
      var consumes = plugin.consumes.concat();
      var resolvedAll = true;
      for (var i=0; i<consumes.length; i++) {
        var service = consumes[i];
        if (!resolved[service]) {
          resolvedAll = false;
        } else {
          plugin.consumes.splice(plugin.consumes.indexOf(service), 1);
        }
      }

      if (!resolvedAll) {
        return;
      }

      plugins.splice(plugins.indexOf(plugin), 1);
      plugin.provides.forEach(function(service) {
        resolved[service] = true;
      });

      sorted.push(app.plugins[plugin.name]);
      changed = true;
    });
  }

  if (plugins.length) {
    debug("Could not resolve dependencies of these plugins:", plugins);
    debug("Resovled services:", resolved);
    throw new Error("Could not resolve dependencies");
  }

  return sorted;
};

/**
 * Ensure a plugin conforms to the minimum api.
 */
Cantina.prototype.checkPlugin = function(plugin) {
  if (!plugin.name) {
    throw new Error('Plugin must have a `name`', plugin);
  }
  if (!plugin.init || (typeof plugin.init !== 'function')) {
    throw new Error('Plugin must have an `init()` method', plugin);
  }
};

/**
 * Find the nearest package.json file from a basedir.
 */
function findPackage(dir) {
  dir = dir || path.dirname(module.parent.filename);
  var pkgPath = path.join(dir, 'package.json');
  if (dir === '/') {
    return false;
  }
  else if (fs.existsSync(pkgPath)) {
    return pkgPath;
  }
  else {
    return findPackage(path.resolve(dir, '..'));
  }
}

