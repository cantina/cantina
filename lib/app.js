/**
 * Cantina: App
 *
 * This is primarily just a flatiron http application with some additional
 * organization and loading conventions.
 */

var flatiron = require('flatiron'),
    amino = require('amino'),
    path = require('path'),
    util = require('util'),
    app = flatiron.app;

// Expose bundled plugins.
exports.plugins = flatiron.common.requireDirLazy(path.join(__dirname, 'plugins'));

// Take options and return the app.
exports.app = function(options) {
  options = options || {};

  // Set root directory.
  if (options.root) {
    app.root = options.root;
  }
  else {
    // Attempt to discover the root.
    app.root = path.dirname(module.parent.filename);
    if (!path.existsSync(path.join(app.root, 'package.json'))) {
      app.root = path.resolve(app.root, '..');
      if (!path.existsSync(path.join(app.root, 'package.json'))) {
        throw new Error('Could not determine application root.  Please provide one.');
      }
    }
  }

  // Use the http plugin.
  app.use(flatiron.plugins.http);

  // Start up the application wih amino.
  app._start = app.start;
  app.start = function() {
    var info;
    // Try to load name and version from parent package.
    try {
      info = require(path.join(app.root, 'package.json'));
    }
    // Fallback to nconf.
    catch (ex) {
      info = {
        name: app.conf.get('name'),
        version: app.conf.get('version')
      };
    }

    // Make sure name and version exist.
    if (!info.name || !info.version) {
      throw new Error('Could not start application server - Missing name or version.');
    }

    // Create an amno service.
    var service = amino.createService(info.name + '@' + info.version);

    // Listen for spec and then startup the http server.
    service.on('spec', function(spec) {
      app._start(spec.port, spec.host, function(err) {
        if (err) throw err;
        app.log.info(util.format('Started %s@%s on http://%s:%s', info.name, info.version, spec.host, spec.port));
      });
    });
  }

  return app;
}
