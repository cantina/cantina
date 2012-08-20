// Modules dependencies.
var EventEmitter = require('events').EventEmitter,
    async = require('async'),
    inherits = require('inherits'),
    debug = require('debug')('cantina');

/**
 * Cantina application class.
 */
function Cantina(options) {
  this.options = options || {};
  this.plugins = {};
  this.services = {};
}
inherits(Cantina, EventEmitter);
module.exports = Cantina;

/**
 * Load configuration.
 */
Cantina.prototype.loadConf = function() {

};

/**
 * Use a plugin.
 */
Cantina.prototype.use = function(plugin) {
  this.plugins[plugin.name] = plugin;
};

/**
 * Remove a plugin.
 */
Cantina.prototype.remove = function(name) {
  delete this.plugins[name];
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

  // Gather services that this plugin consumes.
  var imports = {};
  if (plugin.consumes) {
    plugin.consumes.forEach(function(name) {
      imports[name] = app.services[name];
    });
  }

  // Initialize the plugin.
  plugin.init(plugin, imports, function(err, provided) {
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
    app.emit('plugin', plugin);
    done();
  });
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


