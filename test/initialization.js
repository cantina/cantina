/**
 * Tests application initialization.
 */

var Cantina = require('../').Cantina,
    assert = require('assert');

describe('initialization', function() {
  var app;

  function setupApp() {
    app = new Cantina();

    app.use({
      name: 'alpha',
      provides: ['a'],
      init: function(options, imports, register) {
        register(null, {
          a: 'This is a'
        });
      }
    });

    app.use({
      name: 'beta',
      consumes: ['a'],
      provides: ['b'],
      init: function(options, imports, register) {
        var a = imports.a;
        register(null, {
          b: 'A said: ' + a
        });
      }
    });
  }

  it('should initialize and emit the `ready` event', function(done) {
    setupApp();
    app.init();
    app.on('ready', function(app) {
      assert.equal(app.services.a, 'This is a', '`alpha` plugin was not correctly initialized');
      assert.equal(app.services.b, 'A said: This is a', '`beta` plugin was not correctly initialized');
      done();
    });
  });

  it('emits errors registered by a plugin', function(done) {
    setupApp();
    app.use({
      name: 'broken',
      init: function(options, imports, register) {
        register(new Error('This is broken'));
      }
    });
    app.init();
    app.on('error', function(err) {
      assert.equal(err.toString(), 'Error: This is broken');
      done();
    });
  });

  it ('calls ready handlers of plugins', function(done) {
    setupApp();
    app.use({
      name: 'eager',
      init: function(options, imports, register) {
        register(null, {});
      },
      ready: function(app) {
        assert.equal(app.services.a, 'This is a', 'App was not initialized');
        done();
      }
    });
    app.init();
  });

  it ('calls error handlers of plugins', function(done) {
    setupApp();
    app.use({
      name: 'broken',
      init: function(options, imports, register) {
        register(new Error('This is broken'));
      },
      error: function(err) {
        assert.equal(err.toString(), 'Error: This is broken');
        done();
      }
    });
    app.init();
    app.on('error', function(err) {
      // We're ignoreing the error here.
    });
  });

});
