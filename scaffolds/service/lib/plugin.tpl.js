/**
 * plugin.js - {{{title}}} plugin.
 */

// Expose this service's package info.
require('pkginfo')(module);

/**
 * Attach the service plugin to an application.
 *
 * `this` will be a reference to the application.
 * You might push models, templates, etc. onto the app here.
 * Services can bind routes via this.router (a director router).
 */
exports.attach = function(options) {

}

/**
 * Detach the service plugin from an application.
 */
exports.detach = function() {

}

/**
 * Respond to application initialization.
 */
exports.init = function(done) {
  done();
}
