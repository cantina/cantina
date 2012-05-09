/**
 * Tests for the plugin: controllers.
 */

var assert = require('assert');

describe('Plugins', function() {
  describe('controllers', function() {
    var cantina = require('../');
    var app = cantina.createApp({
      root: __dirname,
      name: 'test-controllers',
      version: '0.0.1',
    });

    before(function() {
      app.use(cantina.plugins.controllers, {path: 'fixtures/controllers'});
    });

    it('should load controllers based on options.path', function(done) {
      var paths = ['apple', 'orange', 'harvest', 'lettuce'],
          path;
      for (var i in paths) {
        path = paths[i];
        assert.ok(typeof app.router.routes[path] === 'object', 'Missing path /' + path);
      }
      done();
    });
  });
});
