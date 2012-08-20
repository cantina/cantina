/**
 * Tests plugin sorting based on dependencies.
 */

var Cantina = require('../').Cantina,
    assert = require('assert');

describe('plugin sorting', function() {
  var app;

  before(function() {
    app = new Cantina();
    app.addPlugin({ name: 'alpha' });
    app.addPlugin({ name: 'beta', consumes: ['a'] });
    app.addPlugin({ name: 'gamma', consumes: ['b'] });
    app.addPlugin({ name: 'delta', consumes: ['a', 'c'] });
    app.addPlugin({ name: 'epsilon', consumes: ['b'], provides: ['a'] });
    app.addPlugin({ name: 'zeta', provides: ['b', 'c'] });
  });

  it('correctly sorts the plugins', function() {
    var sorted = app.sortedPlugins(),
        services = {};

    sorted.forEach(function(plugin) {
      if (plugin.provides) {
        plugin.provides.forEach(function(name) {
          services[name] = true;
        });
      }
      if (plugin.consumes) {
        plugin.consumes.forEach(function(name) {
          assert(services[name], 'Service `' + name + '` was consumed before it was provided');
        });
      }
    });
  });

  it('throws when plugin dependencies cannot be resolved', function() {
    app.addPlugin({ name: 'eta', consumes: ['d'] });
    assert.throws(function() {
      app.sortedPlugins();
    }, /Could not resolve dependencies/, 'Sorting did not throw the resolve error');
  });

});
