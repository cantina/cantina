/**
 * Tests for the static plugin.
 */

var assert = require('assert'),
    cantina = require('../'),
    amino = require('amino');

describe('Plugin: Static', function() {
  var app;

  describe('Serving Content', function() {
    // Create a fresh app before each test.
    beforeEach(function(done) {
      app = cantina.createApp({
        root: __dirname,
        name: 'cantina-test-plugin-static',
        version: '0.0.1',
        silent: true
      });
      app.use(cantina.plugins.static, {
        path: 'fixtures/static'
      });
      app.start(done);
    });

    // Stop the app after each test.
    afterEach(function(done) {
      app.stop(true, done);
    });

    it('should serve static content', function(done) {
      amino.request('amino://' + app.info.name + '/turtles.txt', function(err, res, body) {
        assert.ifError(err);
        assert.equal(body, 'Leonardo, Raphael, Michelangelo, Donatello', 'the static content was not served');
        done();
      });
    });
  });

  describe('Errors', function() {
    it('should throw an error for a non-http app', function() {
      app = cantina.createApp({
        mode: 'cli',
        root: __dirname,
        name: 'cantina-test-plugin-static',
        version: '0.0.1',
        silent: true
      });

      assert.throws(
        function() {
          app.use(cantina.plugins.static, {path: 'fixtures/static'});
        },
        /only be used with `http` apps/,
        'The error was not thrown or the message was wrong.'
      );
    });

    it('should throw an error for a bad options.path', function() {
      app = cantina.createApp({
        root: __dirname,
        name: 'cantina-test-plugin-static',
        version: '0.0.1',
        silent: true
      });

      assert.throws(
        function() {
          app.use(cantina.plugins.static, {path: 'fixtures/bad'});
        },
        /directory does not exist/,
        'The error was not thrown.'
      );
    });

    it('should throw an error if app.root is not defined', function() {
      app = cantina.createApp({
        root: __dirname,
        name: 'cantina-test-plugin-static',
        version: '0.0.1',
        silent: true
      });

      assert.throws(
        function() {
          app.root = undefined;
          app.use(cantina.plugins.static, {path: 'fixtures/static'});
        },
        /must be defined/,
        'The error was not thrown.'
      );
    });
  });
});
