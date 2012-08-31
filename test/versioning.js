/**
 * Tests plugin versioning based on dependencies.
 */

var Cantina = require('../').Cantina,
    assert = require('assert');

describe('versioning', function() {
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
  });

  it('does not throw when plugin dependencies are ok', function() {
    app.use(plugin({
      name: 'alpha',
      version: "1.0.0"
    }));
    app.use(plugin({
      name: 'beta',
      version: "1.5.0",
      imports: { "alpha": ">=0.0.0"}
    }));
    app.use(plugin({
      name: 'gamma',
      version: "2.0.0",
      imports: { "beta": ">=1.5.0"}
    }));
    app.use(plugin({
      name: 'epsilon',
      version: "0.0.1",
      imports: { "alpha": "1.0.0", "beta": "1.5.0" }
    }));
  });

  it('throws when a dependency is missing', function() {
    assert.throws(
      function() {
        app.use(plugin({
          name: "zeta",
          version: "1.0.0",
          imports: { "delta": "0.4.0" }
        }));
      },
      /missing/
    );
  });

  it('throws when a dependency is the wrong version', function() {
    assert.throws(
      function() {
        app.use(plugin({
          name: "kappa",
          version: "1.0.0",
          imports: { "alpha": "~0.4.0" }
        }));
      },
      /wrong version/
    );
  });

});
