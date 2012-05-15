/**
 * {{title}}
 */

var _plugin, _app;

// Expose this service's package info.
require('pkginfo')(module);

// Lazy-load the plugin.
exports.__defineGetter__('plugin', function () {
  if (!_plugin) {
    _plugin = require('./plugin');
  }
  return _plugin;
});

// Lazy-load the app.
exports.__defineGetter__('app', function () {
  if (!_app) {
    _app = require('./app');
  }
  return _app;
});
