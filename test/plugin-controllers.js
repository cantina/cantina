/**
 * Tests for the plugin: controllers.
 */

var assert = require('assert'),
    cantina = require('../');

describe('Plugin: Controllers', function() {
  var app;

  before(function(done) {
    app = cantina.createApp({
      root: __dirname,
      name: 'cantina-test-plugin-controllers',
      version: '0.0.1',
      silent: true
    });

    app.use(cantina.plugins.controllers, {path: 'fixtures/controllers'});

    done();
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
