module.exports = {

  name: 'utils',
  version: require('../../package.json').version,

  init: function(app, done) {
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

      if (arguments.length === 2) {
        defaults = obj;
        obj = deep;
        deep = false;
      }

      // Clone the defaults so we dont transfer any properties by reference.
      if (deep) {
        copy = utils.clone(defaults);
      }
      else {
        copy = defaults;
      }

      Object.keys(copy).forEach(function(key) {
        if (deep && (typeof obj[key] === 'object') && (typeof copy[key] === 'object')) {
          module.exports(deep, obj[key], copy[key]);
        }
        else if (!obj.hasOwnProperty(key)) {
          obj[key] = copy[key];
        }
      });
    };

    done();
  }
};
