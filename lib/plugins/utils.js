/**
 * Adds some utility functions to a cantina app.
 */

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

  /**
   * Extend an object with defaults.
   */
  app.utils.defaults = function(obj, props) {
    for (var prop in props) {
      if (props.hasOwnProperty(prop)) {
        if (!obj.hasOwnProperty(prop)) {
          obj[prop] = props[prop];
        }
      }
    }
  };
};
