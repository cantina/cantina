/**
 * Route-aware middleware
 */

var util = require('util');

exports = module.exports = {
  name: 'middleware',
  description: 'Route-aware middleware'
};

exports.attach = function(options) {
  var app = this;

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
        if (isMatch.call(app, method, path, req)) {
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

function isMatch(method, path, req) {
  if (method && method !== '*' && method !== req.method) {
    return false;
  }
  if (path) {
    var reqPath = this.utils.parseUrl(req.url).pathname;
    // regex style
    if (util.isRegExp(path) && !path.match(reqPath)) {
      return false;
    }
    // glob style
    else if (path.indexOf('*') !== -1) {
      path = path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace("\\*", ".*");
      var regex = new RegExp('/^' + path + '$/');
      if (!regex.match(parsed.pathname)) {
        return false;
      }
    }
    // exact match style
    else {
      path = this.utils.parseUrl(path).pathname;
      if (path !== reqPath) {
        return false;
      }
    }
  }
  return true;
}