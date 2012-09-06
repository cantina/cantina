module.exports = {

  name: 'utils',
  version: require('../../package.json').version,

  init: function(app, done) {
    app.utils = require('util');
    app.utils.async = require('async');
    app.utils.glob = require('glob');

    // Single-level-deep clone
    app.utils.clone = function (obj) {
      if (typeof obj !== 'object') {
        return obj;
      }
      var ret = {};
      Object.keys(obj).forEach(function (k) {
        ret[k] = obj[k];
      });
      return ret;
    };

    // Single-level-deep defaults
    app.utils.defaults = function (obj, defaults) {
      Object.keys(defaults).forEach(function(k) {
        if (typeof obj[k] === 'undefined') {
          obj[k] = app.utils.clone(defaults[k]);
        }
      });
    };

    done();
  }
};
