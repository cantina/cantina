/**
 * Cantina CLI command: 'info'
 * -----------------------------
 *
 * Ouput info from package.json about cantina's version.
 *
 * @module cantina
 * @exports {Function} CLI callback for the 'info' command.
 */

// Module dependencies.
var json = require('../../package.json');

/**
 * The 'info' command.
 *
 * @method info
 * @param [property] {String} A specific property to view.
 * @param callback {Function} Will be called when the command is complete.
 * @return null
 * @for cantina.cli
 * @async
 */
var info = module.exports = function(property, callback) {
  var app = this;

  if (typeof property === 'function') {
    callback = property;
    property = false;
  }

  if (property) {
    if (json[property]) {
      console.dir(json[property]);
    }
    else {
      console.error('No value for property: ' + property);
    }
  }
  else {
    console.dir(json);
  }
  callback();
};