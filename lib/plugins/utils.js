/**
 * Cantina Utils Plugin
 * --------------------
 *
 * Utility functions for use inside and outside of cantina apps.
 *
 * @module cantina
 * @exports {Object} The utils plugin.
 * @requires url
 */

// Module dependencies.
var parse = require('url').parse;

// Cached urls.
var _parsedUrls = {};

/**
 * Utils Plugin
 * ------------
 *
 * Provides utility function and exposes them on a cantina application object.
 *
 * @class cantina.plugins.utils
 */
var utils = module.exports = {
  name: 'utils',
  description: 'Utility functions for cantina apps'
};

/**
 * Attach the plugin to an application.
 *
 * @method attach
 * @param options {Object} The plugin options.
 */
utils.attach = function(options) {
  var app = this;

  /**
   * Application utilities (mirrored from `cantina.plugins.utils`).
   *
   * Please see the `cantina.plugins.utils` docs for more info.
   *
   * @property utils
   * @type {Object}
   * @for app
   */
  app.utils = app.utils || {};

  // Expose utils on the app object.
  app.utils.defaults = utils.defaults;
  app.utils.lazy = utils.lazy;
  app.utils.parseUrl = utils.parseUrl;
};

/**
 * Extend an object with defaults.
 *
 * @method defaults
 * @param obj {Object} The object to extend.
 * @param props {Object} An object containing the defaults.
 * @for cantina.plugins.utils
 *
 * @example
 *     var options = {
 *       color: 'red'
 *     };
 *
 *     app.utils.defaults(options, {
 *       color: 'blue',
 *       size: 'small'
 *     });
 *
 *     console.dir(options);
 *     // { color: 'red', size: 'small' }
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
 * @method lazy
 * @param obj {Object} The target object to extend with the module properties.
 * @param [root] {String} A path for which the `paths` will be assumed to be
 *   relative to.
 * @param paths {Object} An object where keys are property names and values
 *   are paths to modules.
 * @for cantina.plugins.utils
 *
 * @example
 *     // Expose some sub-modules as lazy-loaded exports.
 *     cantina.plugins.utils.lazy(module.exports, __dirname, {
 *       cool: 'submodules/cool',
 *       groovy: 'submodules/groovy'
 *     });
 *
 *     // Now module.exports will have `cool` and `groovy` properties that,
 *     // when accessed, will require() their respective modules and provide
 *     // those module's exports.
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
 *
 * @method parseUrl
 * @param url {String} The url to parse.
 * @return {Object} The parsed url.
 * @for cantina.plugins.utils
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
