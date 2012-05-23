/**
 * Adds some utility functions to a cantina app.  Some utils can also be used
 * outside of an app.
 */

var parse = require('url').parse;

var utils = module.exports = {
  name: 'utils',
  description: 'Utility functions for cantina apps'
};

/**
 * Attach utility functions.
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
 * Lazy-load a module as a property on an object.
 *
 * obj - the target.
 * root - (optional) if defined, then paths are assumed to be relative to it.
 * paths - an object where keys are property names and values are paths.
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

// Cached url parser.
var _parsedUrls = {};
utils.parseUrl = function(url) {
  var parsed = _parsedUrls[url];
  if (parsed) {
    return parsed;
  }
  else {
    return _parsedUrls[url] = parse(url);
  }
}