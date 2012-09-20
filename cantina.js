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
    inherits = require('util').inherits,
    eventflow = require('eventflow');

/**
 * Cantina application class.
 */
function Cantina() {
  EventEmitter.call(this);
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
 * Setup the app.
 */
Cantina.prototype.setup = function (root, callback) {
  this.conf = etc().use(etcYaml).argv().env();

  if (typeof root === 'function') {
    callback = root;
    root = null;
  }

  function _setup (done, err, pkgPath, pkgData) {
    if (err) return done(err);

    // Set pkg and root paths.
    this.pkgPath = pkgPath;
    this.pkgData = pkgData;
    this.root = path.dirname(pkgPath);

    // Add ./etc of parent.
    this.conf.folder(path.join(this.root, 'etc'));

    // Add package.json of the app.
    this.conf.pkg(this.pkgPath);

    // Load the utils plugin.
    require(this.plugins.utils);

    done();
  }

  if (root) {
    findPkg(root, _setup.bind(this, callback));
  }
  else {
    findPkg(path.resolve(__dirname, '../'), _setup.bind(this, callback));
  }
};

/**
 * Initialize the app.
 */
Cantina.prototype.init = function (callback) {
  var app = this;

  app.series('init', function (err) {
    if (err) {
      if (callback) {
        callback(err);
      }
      else {
        app.emit('error', err);
      }
    }
    else {
      app.series('ready', function(err) {
        if (callback) callback(err);
      });
    }
  });
};

// Export a Cantina instance.
module.exports = new Cantina();
