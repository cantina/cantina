module.exports = {

  name: 'utils',
  version: require('../../package.json').version,

  init: function(app, done) {
    app.utils = require('util');
    app.utils.async = require('async');
    app.utils.glob = require('glob');

    app.utils.defaults = function (obj, defaults) {
      Object.keys(defaults).forEach(function(key) {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = copy[key];
        }
      });
    };

    done();
  }
};
