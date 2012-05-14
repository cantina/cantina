/**
 * Tests for the plugin: controllers.
 */

var assert = require('assert'),
    cantina = require('../');

describe('Plugin: Controllers', function() {
  var app;

  beforeEach(function() {
    app = cantina.createApp({
      root: __dirname,
      name: 'cantina-test-plugin-controllers',
      version: '0.0.1',
      silent: true
    });
  });

  it('should load controllers based on options.path', function() {
    var paths = ['apple', 'orange', 'harvest', 'lettuce'],
        path;

    app.use(cantina.plugins.controllers, {path: 'fixtures/controllers'});

    for (var i in paths) {
      path = paths[i];
      assert.ok(typeof app.router.routes[path] === 'object', 'Missing path /' + path);
    }
  });

  it('should throw an error for a bad options.path', function() {
    assert.throws(
      function() {
        app.use(cantina.plugins.controllers, {path: 'fixtures/bad'});
      },
      /directory does not exist/,
      'The error was not thrown.'
    );
  });

  it('should throw an error if app.root is not defined', function() {
    assert.throws(
      function() {
        app.root = undefined;
        app.use(cantina.plugins.controllers, {path: 'fixtures/controllers'});
      },
      /must be defined/,
      'The error was not thrown.'
    );
  });
});
