/**
 * Tests application initialization.
 */

var Cantina = require('../').Cantina,
    assert = require('assert'),
    path = require('path');

describe('initialization', function() {
  var app;

  function setupApp() {
    app = new Cantina();

    app.use({
      name: 'alpha',
      version: "0.0.1",
      init: function(app, cb) {
        app.alpha = 'This is alpha';
        cb();
      }
    });

    app.use({
      name: 'beta',
      version: "0.0.1",
      dependencies: {
        "alpha": ">=0.0.1"
      },
      init: function(app, cb) {
        app.beta = 'Alpha said: ' + app.alpha;
        cb();
      }
    });
  }

  it('should initialize and emit the `ready` event', function(done) {
    setupApp();
    app.init(function(err, app) {
      assert.ifError(err);
      assert.equal(app.alpha, 'This is alpha', '`alpha` plugin was not correctly initialized');
      assert.equal(app.beta, 'Alpha said: This is alpha', '`beta` plugin was not correctly initialized');
      done();
    });
  });

  it('emits errors registered by a plugin', function(done) {
    setupApp();
    app.use({
      name: 'broken',
      version: "0.0.1",
      init: function(app, cb) {
        cb(new Error('This is broken'));
      }
    });
    app.on('error', function(err) {
      assert.equal(err.toString(), 'Error: This is broken');
      done();
    });
    app.init(function(err){
      // do nothing.
    });
  });

  it ('calls ready handlers of plugins', function(done) {
    setupApp();
    app.use({
      name: 'eager',
      version: "0.0.1",
      init: function(app, cb) {
        cb();
      },
      ready: function(app, cb) {
        assert.equal(app.alpha, 'This is alpha', 'App was not initialized');
        done();
      }
    });
    app.init(function(){});
  });

  it ('calls error handlers of plugins', function(done) {
    setupApp();
    app.use({
      name: 'wanterror',
      version: "0.0.1",
      init: function(app, cb) {
        cb(new Error('This is broken'));
      },
      error: function(err) {
        assert.equal(err.toString(), 'Error: This is broken');
        done();
      }
    });
    app.init(function(){});
    app.on('error', function(err) {
      // We're ignoreing the error here.
    });
  });

  it('can resolve the application root', function(done) {
    var root = path.dirname(module.filename);
    var resolveTest = {
      name: 'resolveTest',
      version: "0.0.1",
      init: function(app, cb) {
        assert.equal(app.resolve('./'), root);
        cb();
      }
    };
    setupApp();
    app.use(resolveTest);
    app.init(function(err) {
      done();
    });
  });

});
