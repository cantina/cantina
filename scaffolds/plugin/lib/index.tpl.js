/**
 * {{title}}
 */

var utils = require('cantina').utils;

// Expose this service's package info.
require('pkginfo')(module);

// Lazy-load sub-modules.
utils.lazy(exports, __dirname, {
  plugin: './plugin'
});