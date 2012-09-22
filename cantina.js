// Modules dependencies.
var EventEmitter = require('events').EventEmitter,
    etc = require('etc'),
    etcYaml = require('etc-yaml'),
    findPkg = require('witwip'),
    fs = require('fs'),
    path = require('path'),
    inherits = require('util').inherits,
    eventflow = require('eventflow');

/**
 * Cantina application class.
 */
function Cantina() {
  EventEmitter.call(this);
  this.setMaxListeners(0);
}
inherits(Cantina, EventEmitter);
eventflow(Cantina);

/**
 * Expose the paths to Cantina's core plugins.
 */
Cantina.prototype.plugins = {};
fs.readdirSync(path.join(__dirname, 'plugins')).forEach(function (plugin) {
  Cantina.prototype.plugins[path.basename(plugin)] = path.join(__dirname, 'plugins', plugin);
});

/**
 * Load the application.
 */
Cantina.prototype.load = function (root, callback) {
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

    // Load the utils plugin.
    require(app.plugins.utils);

    callback();
  }

  if (root) {
    findPkg(root, setup);
  }
  else {
    findPkg(path.dirname(module.parent.filename), setup);
  }
};

/**
 * Initialize the app.
 */
Cantina.prototype.init = function (callback) {
  var app = this;

  // Default error handler.
  if (!app.listeners('error').length) {
    app.on('error', function(err) {
      console.error(err);
    });
  }

  // Run plugin 'init' and 'ready' listeners.
  app.series('init', function (err) {
    if (err) {
      if (callback)
        callback(err);
      else
        app.emit('error', err);
    }
    else {
      app.series('ready', function(err) {
        if (err) {
          if (callback)
            callback(err);
          else
            app.emit('error', err);
        }
        else if (callback) {
          callback();
        }
      });
    }
  });
};

// Export a Cantina instance.
module.exports = new Cantina();
