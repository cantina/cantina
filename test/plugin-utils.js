/**
 * test/plugin-utils.js - Tests for the utils plugin.
 */

var assert = require('assert'),
    cantina = require('../');

describe('Plugin: Utils', function() {
  var app = cantina.createApp();
  it ('should expose utils on the app object', function() {
    assert.equal(typeof app.utils, 'object', 'The utils are not exposed');
  });
});
