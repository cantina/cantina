/**
 * {{{title}}}
 *
 * {{{description}}}
 *
 * @module cantina
 * @submodule {{{name}}}
 */

// Modules dependencies.
var cantina = require('cantina');

// Register the plugin on `cantina.plugins`.
cantina.utils.lazy(cantina.plugins, __dirname, {
  '{{{name}}}': './plugin'
});

// Export sub-modules.
cantina.utils.lazy(exports, __dirname, {
  plugin: './plugin',
  service: './service'
});
