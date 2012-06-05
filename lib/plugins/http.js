/**
 * Cantina HTTP plugin.
 *
 * @module cantina
 * @exports {Object} The http plugin.
 * @requires flatiron, union, [nconf], [amino]
 */

// Module dependencies.
var flatiron = require('flatiron');

/**
 * The http plugin.
 *
 * Loads the flatiron http plugin and, optionally, sets up the application as
 * an amino service.
 *
 * @class cantina.plugins.http
 */
var http = module.exports = {
  name: 'http',
  description: 'Provides http-specific functionality for cantina apps'
};

/**
 * Attach the plugin to an application.
 *
 * If the app is using amno, then the app's start() method will start up an
 * amino service with a name and version based on package.json or the options.
 *
 * Otherwise, the app will be started as regular flatiron http app.
 *
 * @method attach
 * @param options {Object} Application options.  If the app is NOT using amino,
 *   then `host` and `port` can be specified here.
 */
http.attach = function(options) {
  var app = this;

  // Use the http plugin.
  app.use(flatiron.plugins.http);

  // TEMPORARY HACK
  // My director pull request was merged, waiting for new npm version.
  // Allow router.attach to be called multiple times.
  var Router = require('../../node_modules/flatiron/node_modules/director').http.Router;
  Router.prototype.attach = function(fn) {
    var self = this;
    this._attaches = this._attaches || [];
    this._attaches.push(fn);
    this._attach = function() {
      if (self._attaches) {
        for (var i in self._attaches) {
          self._attaches[i].call(this);
        }
      }
    }
  }

  // Attach the app object to the director router.
  app.router.attach(function() {
    this.app = app;
  });

  // Amino or http app setup.
  if (options.amino) {
    http.setupAmino(app, options);
  }
  else {
    http.setupHttp(app, options);
  }
}

/**
 * Setup the application as an amino service.
 *
 * @method setupAmino
 * @param app {Object} The cantina application instance.
 * @param options {Object} The application options.
 * @for cantina.plugins.http
 */
http.setupAmino = function(app, options) {
  var amino;

  // Attempt to require amino.
  try {
    amino = require('amino');
  }
  catch (ex) {
    console.warn('cantina.plugins.http depends on "amino" being installed.');
    console.warn('install using `npm install amino`.');
    process.exit(1);
  }

  /**
   * Expose `amino` on the application.  Allows plugins to interract with
   * amino without needing to explicitly require it.
   *
   * @property amino
   * @type {Object}
   * @for app
   */
  app.amino = amino;

  // Save a reference to the old start() method.
  app._start = app.start;

  /**
   * If `options.amino === true`, overrides `app.start()` to create an amino
   * service and listen on it.
   *
   * Will emit a 'started' event on the app.
   *
   * @method start
   * @param [callback] {Function} (err) Called after the app has been started.
   * @for app
   */
  app.start = function(callback) {
    /**
     * Creates and saves a reference to the amino service.
     *
     * @property service
     * @type {Object}
     * @for app
     */
    app.service = amino.createService(app.info.name + '@' + app.info.version);

    // Listen for spec and then startup the http server.
    app.service.on('spec', function(spec) {
      app.spec = spec;
      app._start(spec.port, spec.host, function(err) {
        if (!err) {
          if (!options.silent) {
            app.log.info(flatiron.common.format('Started %s@%s on http://%s:%s', app.info.name, app.info.version, spec.host, spec.port));
          }
        }
        app.emit('started');
        if (callback) callback(err);
      });
    });
  };

  /**
   * If `options.amino === false`, stops the amino-powered application and
   * closes the service.
   *
   * @method stop
   * @param [hard] {Boolean} If true, then immediately clear the service
   *   from the globalAgent.  Useful for testing.
   * @param [callback] {Function} (err) Called after the app has been stopped.
   * @for app
   */
  app.stop = function(hard, callback) {
    if (typeof hard === 'function') {
      callback = hard;
      hard = false;
    }
    if (hard) {
      app.service.close(function() {
        amino.globalAgent.services[app.info.name] = [];
        callback();
      });
    }
    else {
      app.service.close(callback);
    }
  };
}

/**
 * Setup a cantina app as a plain flatiron application.
 *
 * @method setupHttp
 * @param app {Object} The cantina application instance.
 * @param options {Object} The application options.
 * @for cantina.plugins.http
 */
http.setupHttp = function(app, options) {
  var nconf = require('nconf');

  nconf.argv().env();

  app.utils.defaults(options, {
    host: nconf.get('host') || null,
    port: nconf.get('port') || 8080
  });

  // Save a reference to the old app.start().
  app._start = app.start;

  /**
   * If `options.amino === false`, overrides `app.start()` to work with the
   * application options.
   *
   * Will emit a 'started' event on the app.
   *
   * @method start
   * @param [callback] {Function} (err) Called after the app has been started.
   * @for app
   */
  app.start = function(callback) {
    var args = [];
    if (options.host) {
      args.push(options.host);
    }
    args.push(options.port);
    args.push(function(err) {
      if (!err) {
        if (!options.silent) {
          options.host = options.host || 'localhost';
          app.log.info(flatiron.common.format('Started %s@%s on http://%s:%s', app.info.name, app.info.version, options.host, options.port));
        }
      }
      app.emit('started');
      if (callback) {
        callback(err);
      }
    });
    app._start.apply(app, args);
  };

  /**
   * If `options.amino === false`, stops the application.
   *
   * @method stop
   * @param [callback] {Function} (err) Called after the app has been stopped.
   * @for app
   */
  app.stop = function(callback) {
    if (callback) {
      app.server.on('close', callback);
    }
    app.server.close();
  };
}
