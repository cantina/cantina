/**
 * Tests plugin configuration.
 */

var Cantina = require('../').Cantina,
    assert = require('assert');

describe('configuration', function() {
  var app;
  var plugin = {
    name: 'prefixer',
    provides: ['prefix'],
    init: function(conf, imports, register) {
      if (!conf.prefix) {
        return register(new Error('No prefix in config'));
      }
      register(null, {
        prefix: function(str) {
          return conf.prefix + str;
        }
      });
    }
  };

  beforeEach(function() {
    app = new Cantina();
  });

  it('uses default conf specified by a plugin', function(done) {
    plugin.conf = { prefix: 'wuzzup ' };
    app.use(plugin);
    app.init();
    app.on('ready', function(app) {
      assert.equal(app.services.prefix('world'), 'wuzzup world', 'The prefix was not added correctly');
      done();
    });
  });

  it('uses per-plugin configuration passed into `app.use()`', function(done) {
    app.use(plugin, { prefix: 'hello:' });
    app.init();
    app.on('ready', function(app) {
      assert.equal(app.services.prefix('world'), 'hello:world', 'The prefix was not added correctly');
      done();
    });
  });

  it('uses configuration specified with `app.conf()`', function(done) {
    app.use(plugin);
    app.conf.set('prefixer', { prefix: 'hi ' });
    app.init();
    app.on('ready', function(app) {
      assert.equal(app.services.prefix('world'), 'hi world', 'The prefix was not added correctly');
      done();
    });
  });

});
