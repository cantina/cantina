/**
 * Tests plugin sorting based on dependencies.
 */

var Cantina = require('../').Cantina,
    assert = require('assert');

describe('plugin sorting', function() {
  var app;

  // Adds an empty init method to test plugin.
  function plugin(props) {
    props.init = function(conf, imports, register) {
      register(null, {});
    };
    return props;
  }

  before(function() {
    app = new Cantina();
    app.use(plugin({ name: 'alpha' }));
    app.use(plugin({ name: 'beta', consumes: ['a'] }));
    app.use(plugin({ name: 'gamma', consumes: ['b'] }));
    app.use(plugin({ name: 'delta', consumes: ['a', 'c'] }));
    app.use(plugin({ name: 'epsilon', consumes: ['b'], provides: ['a'] }));
    app.use(plugin({ name: 'zeta', provides: ['b', 'c'] }));
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
    app.use(plugin({ name: 'eta', consumes: ['d'] }));
    assert.throws(function() {
      app.sortedPlugins();
    }, /Could not resolve dependencies/, 'Sorting did not throw the resolve error');
  });

  it('keeps plugins in order that don\'t need to be rearranged', function() {
    app.remove('eta');
    app.use(plugin({ name: 'first', consumes: ['a', 'b'] }));
    app.use(plugin({ name: 'second', consumes: ['a', 'b'] }));
    app.use(plugin({ name: 'third', consumes: ['a', 'b'] }));
    app.use(plugin({ name: 'fourth', consumes: ['a', 'b'] }));

    var names = app.sortedPlugins().map(function(plugin) {
      return plugin.name;
    });

    assert(names.indexOf('first') === names.indexOf('second') - 1, 'first and second not in correct order');
    assert(names.indexOf('second') === names.indexOf('third') - 1, 'second and third not in correct order');
    assert(names.indexOf('third') === names.indexOf('fourth') - 1, 'third and fourth not in correct order');
  });

});
