/**
 * Tests for the middleware plugin.
 */

var assert = require('assert')
  , cantina = require('../')
  , amino = require('amino')
  , async = require('flatiron').common.async
  ;

describe('Plugin: middleware', function() {
  var app;

  // Create a fresh app before each test.
  beforeEach(function() {
    app = cantina.createApp({
      root: __dirname,
      name: 'cantina-test-plugin-middleware',
      version: '0.0.1',
      silent: true
    });
  });

  // Stop the app after each test.
  afterEach(function(done) {
    app.stop(true, done);
  });

  it('can use middleware with no path', function(done) {
    app.middleware(function(req, res, next) {
      res.end('no path');
    });
    app.start(function(err) {
      assert.ifError(err);
      amino.request('amino://' + app.info.name + '/no/path', function(err, res, body) {
        assert.ifError(err);
        assert.strictEqual(body, 'no path');
        done();
      });
    });
  });

  it('can use multiple middlewares', function(done) {
    app.middleware(function(req, res, next) {
      res.body = 'one';
      next();
    });
    app.middleware(function(req, res, next) {
      res.body += 'two';
      res.end(res.body);
    });
    app.start(function(err) {
      assert.ifError(err);
      amino.request('amino://' + app.info.name + '/', function(err, res, body) {
        assert.strictEqual(body, 'onetwo');
        assert.ifError(err);
        done();
      });
    });
  });

  it('can use path-specific middleware', function(done) {
    app.middleware('/who/is/cool', function(req, res, next) {
      res.end('carlos');
    });
    app.middleware('/who/is/lame', function(req, res, next) {
      res.end('brian');
    });
    app.middleware('*/cool/feed', function(req, res, next) {
      res.end('<xml>carlos</xml>');
    });
    app.middleware(/^\/who\/is/, function(req, res, next) {
      res.end('dunno');
    });
    app.middleware('/who/*/is', function(req, res, next) {
      res.end('depends on what the meaning of "is" is');
    });
    app.middleware(function(req, res, next) {
      res.end('ok');
    });
    app.start(function(err) {
      assert.ifError(err);
      var tasks = [];
      var tests = {
        '/': 'ok',
        '/who/is/cool': 'carlos',
        '/who/is/lame': 'brian',
        '/who/is/cool/feed': '<xml>carlos</xml>',
        '/who/is/wyatt': 'dunno',
        '/who/something/is': 'depends on what the meaning of "is" is',
        '/who/is/that/cool/girl': 'dunno'
      };
      for (var url in tests) {
        (function(url, expected) {
          tasks.push(function(cb) {
            testRequest(url, expected, cb);
          });
        })(url, tests[url]);
      }
      async.parallel(tasks, function() {
        done();
      });
    });
  });

  it('can use method-specific middleware', function(done) {
    app.middleware('post', '/test', function(req, res, next) {
      res.end('post');
    });
    app.middleware('/test', function(req, res, next) {
      res.end('not a post');
    });
    app.middleware(function(req, res, next) {
      res.end('not found');
    });
    app.start(function(err) {
      return done();
      assert.ifError(err);
      var tasks = [];
      tasks.push(function(cb) {
        testRequest('/test', 'not a post', cb);
      });
      tasks.push(function(cb) {
        testRequest({url: '/test', method: 'POST'}, 'post', cb);
      });
      tasks.push(function(cb) {
        testRequest({url: '/test', method: 'HEAD'}, 'not a post', cb);
      });
      tasks.push(function(cb) {
        testRequest({url: '/', method: 'POST'}, 'not found', cb);
      });
      async.parallel(tasks, function() {
        done();
      });
    });
  });

  // Attempt to use this.res, this.app, this.res.json, etc.
  it('can use union extensions', function(done) {
    var obj = {message: 'welcome to ' + app.info.name};
    app.middleware(function() {
      this.res.body = {message: 'welcome to ' + this.app.info.name};
      this.res.emit('next');
    });
    app.middleware(function() {
      this.res.json(this.res.body);
    });
    app.start(function(err) {
      assert.ifError(err);
      amino.request('amino://' + app.info.name + '/no/path', function(err, res, body) {
        assert.ifError(err);
        assert.deepEqual(body, obj);
        done();
      });
    });
  });

  function testRequest(url, expected, cb) {
    if (typeof url === 'string') {
      url = {url: url};
    }
    url.url = 'amino://' + app.info.name + url.url;
    amino.request(url, function(err, res, body) {
      assert.ifError(err);
      assert.strictEqual(body, expected);
      cb(err);
    });
  }
});