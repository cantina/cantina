/**
 * {{title}}
 */

var utils = require('cantina').plugins.utils;

// Expose this service's package info.
require('pkginfo')(module);

// Lazy-load sub-modules.
utils.lazy(exports, __dirname, {
  plugin: './plugin',
  service: './service'
});