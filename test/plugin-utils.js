/**
 * Test the application utility functions.
 */

var assert = require('assert'),
    cantina = require('../');

describe('Plugin: Utils', function() {
  var app = cantina.createApp();

  describe('Defaults', function() {
    var start, defaults, end;

    start = {
      color: 'red',
      count: 5
    };
    defaults = {
      count: 10,
      size: 'large'
    };
    end = {
      color: 'red',
      count: 5,
      size: 'large'
    };

    it('should apply default properties to an object', function() {
      app.utils.defaults(start, defaults);
      assert.deepEqual(start, end, 'Default properties were copied incorrectly');
    });

  });
});