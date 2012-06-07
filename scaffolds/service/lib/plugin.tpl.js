/**
 * Cantina: {{{title}}} Plugin
 *
 * @module cantina
 * @sublmodule {{{name}}}
 */

// Expose this service's package info.
require('pkginfo')(module);

/**
 * Attach the service plugin to an application.
 *
 * `this` will be a reference to the application.
 * You might push models, templates, etc. onto the app here.
 * Services can bind routes via this.router (a director router).
 *
 * @method attach
 * @param options {Object} Plugin options.
 */
exports.attach = function(options) {

}

/**
 * Detach the service plugin from an application.
 *
 * @method detach
 */
exports.detach = function() {

}

/**
 * Respond to application initialization.
 *
 * @method init
 * @param callback {Function} A callback to invoke when initialization completes.
 */
exports.init = function(callback) {
  callback();
}
