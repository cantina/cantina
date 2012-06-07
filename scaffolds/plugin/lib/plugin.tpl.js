/**
 * Cantina: {{{title}}} Plugin
 * ------------------
 *
 * {{{description}}}
 *
 * @module cantina
 * @submodule {{{name}}}
 */

// Expose this service's package info.
require('pkginfo')(module);

/**
 * {{{Title}}} Plugin
 *
 * {{{description}}}
 *
 * @class {{{name}}}
 */

/**
 * Attach the plugin to an application.
 *
 * `this` will be a reference to the application.
 * You might attach models, templates, etc. onto the app here.
 * Services can bind routes via this.router (a director router).
 *
 * @method attach
 * @param [options] {Object} Plugin options.
 */
exports.attach = function(options) {

}

/**
 * Detach the service plugin from the application.
 *
 * @method detach
 */
exports.detach = function() {

}

/**
 * Respond to application initialization.
 *
 * @method init
 * @param callback {Function} Callback to invoke once initialization is complete.
 */
exports.init = function(callback) {
  callback();
}
