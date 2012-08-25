/**
 * Tests createApp().
 */

var cantina = require('../'),
    assert = require('assert'),
    path = require('path');

describe('createApp()', function() {
  var app;
  var plugins = [
    './plugins/math',
    './plugins/add',
    './plugins/subtract'
  ];

  it('can create an application', function(done) {
    cantina.createApp(plugins, function(err, app) {
      var add = app.services.math.add,
          subtract = app.services.math.subtract,
          num = subtract(add(10, 5), 5);

      assert.ifError(err);
      assert.equal(num, 10);
      assert.equal(app.services.math.incr(10), 20);
      done();
    });
  });

  it('can create an application with configuration', function(done) {
    var conf = { math: { incr: 5 }};
    cantina.createApp(plugins, conf, function(err, app) {
      assert.ifError(err);
      assert.equal(app.services.math.incr(10), 15);
      done();
    });
  });

  it('can resolve the application root', function(done) {
    var root = path.dirname(module.filename);
    var resolveTest = {
      name: 'resolveTest',
      init: function(conf, imports, register) {
        assert.equal(imports.core.resolve('./'), root);
        done();
      }
    };
    cantina.createApp([resolveTest], function(err, app) {
      // The test is finished during plugin initialization.
    });
  });

});
