var app = require('../../');

app.utils = require('util');
app.utils.async = require('async');
app.utils.glob = require('glob');
app.utils.clone = require('clone');

/**
 * Extend an object with defaults.
 *
 * @param [deep] {Boolean} If true, performs a deep (recursive) merge.
 * @param obj {Object} The object to extend.
 * @param defaults {Object} An object containing the defaults.
 */
app.utils.defaults = function (deep, obj, defaults) {
  var copy;

  // Shallow.
  if (deep !== true) {
    defaults = obj;
    obj = deep;
    deep = false;
  }

  // Support arbitrary number of defaults objects.
  if (arguments.length > 2) {
    var mixins = Array.prototype.slice.call(arguments, (deep === true) ? 2 : 1);
    if (mixins.length > 1) {
      mixins.forEach(function (mixin) {
        if (deep === true) {
          app.utils.defaults(true, obj, mixin);
        }
        else {
          app.utils.defaults(obj, mixin);
        }
      });
      return obj;
    }
  }

  // Clone the defaults so we dont transfer any properties by reference.
  if (deep === true) {
    copy = app.utils.clone(defaults);
  }
  else {
    copy = defaults;
  }

  Object.keys(copy).forEach(function(key) {
    // Only dive into object literals.
    if (deep && app.utils.isObjectLiteral(obj[key]) && app.utils.isObjectLiteral(copy[key])) {
      app.utils.defaults(deep, obj[key], copy[key]);
    }
    else if (!obj.hasOwnProperty(key)) {
      obj[key] = copy[key];
    }
  });

  return obj;
};

/**
 * Check if an object is an object literal.
 */
app.utils.isObjectLiteral = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
