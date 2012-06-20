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

var cantinaUtils = require('cantina-utils');

/**
 * Utils Plugin
 * ------------
 *
 * Exposes utilities on a cantina application object.
 *
 * @class cantina.plugins.utils
 */
var utils = module.exports = {
  name: 'cantina-utils',
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
   * Application utilities (copied from `cantina-utils`).
   *
   * Please see the `cantina-utils` docs for more info.
   *
   * @property utils
   * @type {Object}
   * @for app
   */
  app.utils = app.utils || cantinaUtils;
};
