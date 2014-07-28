var assert = require('assert')
  , createApp = require('../').createApp;

describe('Cantina Application', function () {
  var app;

  beforeEach(function (done) {
    app = createApp();
    app.boot(function(err) {
      if (err) return done(err);
      done(err);
    });
  });

  afterEach(function (done) {
    app.destroy(done);
  });

  describe('error', function () {
    it('can listen for runtime error', function (done) {
      app.on('error', function (err) {
        assert.equal(err.message, 'geez');
        done();
      });

      setTimeout(function () {
        app.emit('error', new Error('geez'));
      }, 100);

      app.start(assert.ifError);
    });

    it('catches init error', function (done) {
      var caught = false;
      app.hook('start').add(function (next) {
        if (!caught)
          next(new Error('whoops'));
        else
          next();
      });
      app.start(function (err) {
        assert(err);
        assert.equal(err.message, 'whoops');
        caught = true;
        done();
      });
    });
  });

  describe('configuration', function () {
    beforeEach(function () {
      app.hook('start').add(function (next) {
        var prefix = app.conf.get('prefix');
        app.prefix = function (str) {
          return prefix + str;
        };
        next();
      });
    });

    it('uses default conf specified like a plugin should', function (done) {
      app.conf.add({
        prefix: 'wuzzup '
      });
      app.start(function (err) {
        assert.ifError(err);
        assert.equal(app.prefix('world'), 'wuzzup world', 'The prefix was not added correctly');
        done();
      });
    });

    it('uses configuration specified with `app.conf().set`', function (done) {
      app.conf.set('prefix', 'hi ');
      app.start(function (err) {
        assert.ifError(err);
        assert.equal(app.prefix('world'), 'hi world', 'The prefix was not added correctly');
        done();
      });
    });
  });

  describe('load', function () {
    it('can load plugins relative to app.root', function () {
      var modules = app.load('plugins');
      assert(app.folderLoaded);
      assert(app.pluginLoaded);
      assert.equal(modules.plugin, undefined);
      assert.equal(modules.folder, 'something');
      assert(Object.keys(modules).length, 2);
    });

    it('can load conf (like a plugin would)', function () {
      app.load('plugins');
      assert.equal(app.conf.get('folder:test'), 'foo');
    });
  });
});
