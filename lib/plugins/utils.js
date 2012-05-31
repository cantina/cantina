/**
 * utils.js - Cantina Utils Plugin
 *
 * Utility functions for use inside and outside of cantina apps.
 */

var parse = require('url').parse,
    _parsedUrls = {};

// Define the plugin.
var utils = module.exports = {
  name: 'utils',
  description: 'Utility functions for cantina apps'
};

/**
 * Attach the plugin to an application.
 */
utils.attach = function(options) {
  var app = this;

  app.utils = app.utils || {};

  // Expose utils on the app object.
  app.utils.defaults = utils.defaults;
  app.utils.lazy = utils.lazy;
  app.utils.parseUrl = utils.parseUrl;
};

/**
 * Extend an object with defaults.
 */
utils.defaults = function(obj, props) {
  for (var prop in props) {
    if (props.hasOwnProperty(prop)) {
      if (!obj.hasOwnProperty(prop)) {
        obj[prop] = props[prop];
      }
    }
  }
};

/**
 * Attach modules to an object as lazy-loaded properties.
 *
 * Params:
 *   - `obj`: the target.
 *   - `root`:
 *       (optional) if defined, then paths are assumed to be
 *       relative to this absolute path.
 *   - `paths`: an object where keys are property names and values are paths.
 */
utils.lazy = function(obj, root, paths) {
  var path = require('path');

  if (!paths) {
    paths = root;
    root = false;
  }

  for (var prop in paths) {
    (function(prop) {
      if (paths.hasOwnProperty(prop)) {
        if (root) {
          paths[prop] = path.resolve(root, paths[prop]);
        }
        obj.__defineGetter__(prop, function () {
          var priv = '_' + prop;
          if (!obj[priv]) {
            obj[priv] = require(paths[prop]);
          }
          return obj[priv];
        });
      }
    })(prop);
  }
}

/**
 * Parse a url and cache the results for repeated calls.
 */
utils.parseUrl = function(url) {
  var parsed = _parsedUrls[url];
  if (parsed) {
    return parsed;
  }
  else {
    return _parsedUrls[url] = parse(url);
  }
}
