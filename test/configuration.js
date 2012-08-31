/**
 * Tests plugin configuration.
 */

var Cantina = require('../').Cantina,
    assert = require('assert');

describe('configuration', function() {
  var app;
  var plugin = {
    name: 'prefix',
    version: "0.0.1",
    init: function(conf, imports, register) {
      if (!conf.prefix) {
        return register(new Error('No prefix in config'));
      }
      register(null, function(str) {
        return conf.prefix + str;
      });
    }
  };

  beforeEach(function() {
    app = new Cantina();
  });

  it('uses default conf specified by a plugin', function(done) {
    plugin.defaults = { prefix: 'wuzzup ' };
    app.use(plugin);
    app.init(function(err, app) {
      assert.ifError(err);
      assert.equal(app.prefix('world'), 'wuzzup world', 'The prefix was not added correctly');
      done();
    });
  });

  it('uses per-plugin configuration passed into `app.use()`', function(done) {
    app.use(plugin, { prefix: 'hello:' });
    app.init(function(err, app) {
      assert.ifError(err);
      assert.equal(app.prefix('world'), 'hello:world', 'The prefix was not added correctly');
      done();
    });
  });

  it('uses configuration specified with `app.conf()`', function(done) {
    app.use(plugin);
    app.conf.set('prefix', { prefix: 'hi ' });
    app.init(function(err, app) {
      assert.ifError(err);
      assert.equal(app.prefix('world'), 'hi world', 'The prefix was not added correctly');
      done();
    });
  });

});
