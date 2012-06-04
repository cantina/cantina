/**
 * Cantina Middleware Plugin
 *
 * @module cantina
 * @exports {Object} The middlware plugin.
 * @requires util
 */

// Module dependencies.
var util = require('util');

/**
 * The middleware plugin.
 *
 * Exposes an api for applications to attach route-aware middleware.
 *
 * @class cantina.plugins.middleware
 */
var middleware = module.exports = {
  name: 'middleware',
  description: 'Route-aware middleware'
};

/**
 * Attach the plugin to an application.
 *
 * Adds the `app.middleware()` method.
 *
 * @method attach
 * @param [options] {Object} Plugin options.
 */
middleware.attach = function(options) {
  var app = this;

  options = options || {};

  /**
   * Attach route-aware middleware to an application
   *
   * @method middleware
   * @param [method] {String} HTTP method ex. 'GET', 'POST', 'PUT', etc.
   * @param [path] {String|RegExp} A string, regex, or glob to match against
   *   the request urls.
   * @param fns {Function|Array} An array of middleware functions, or a
   *   single function.
   *
   * @return {Object} The application instance.
   * @chainable
   * @for app
   */
  app.middleware = function(method, path, fns) {
    if (arguments.length === 1) {
      fns = method;
      method = path = null;
    }
    else if (arguments.length === 2) {
      fns = path;
      path = method;
      method = null;
    }
    if (typeof fns === 'function') {
      fns = [fns];
    }
    fns.forEach(function(fn) {
      app.http.before.push(function(req, res, next) {
        if (exorts.isMatch.call(app, method, path, req)) {
          var thisArg = {req: req, res: res, app: app};
          fn.call(thisArg, req, res, next);
        }
        else {
          next();
        }
      });
    });
    return app;
  }
};

/**
 * Determine if a path filter matches the requested url.
 *
 * @method isMatch
 * @param [method] {String} An HTTP method or '*'.
 * @param [path] {String|RegExp} A string, glob, or regex to test.
 * @param req {Object} An http request object.
 * @return {Boolean} Whether or not the method and/or path matches the current
 *   request url.
 * @for cantina.plugins.middleware
 */
middleware.isMatch = function(method, path, req) {
  if (method && method !== '*' && method.toLowerCase() !== req.method.toLowerCase()) {
    return false;
  }
  if (path) {
    var reqPath = this.utils.parseUrl(req.url).pathname;
    // regex style
    if (util.isRegExp(path)) {
      if (!path.test(reqPath)) {
        return false;
      }
    }
    // glob style
    else if (path.indexOf('*') !== -1) {
      path = path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace("\\*", ".*");
      var regex = new RegExp('^' + path + '$');
      if (!regex.test(reqPath)) {
        return false;
      }
    }
    // exact match style
    else {
      if (this.utils.parseUrl(path).pathname !== reqPath) {
        return false;
      }
    }
  }
  return true;
}
