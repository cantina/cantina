var app = require('../'),
    request = require('superagent'),
    assert = require('assert'),
    path = require('path'),
    port = 5000;

describe('Cantina Application', function () {

  before(function (done) {
    app.load(function () {
      done();
    });
  });

  /****************************************************************************/
  describe('error', function () {
    it('can listen for runtime error', function (done) {
      app.on('error', function (err) {
        assert.equal(err.message, 'geez');
        done();
      });

      setTimeout(function () {
        app.emit('error', new Error('geez'));
      }, 100);

      app.init(assert.ifError);
    });

    it('catches init error', function (done) {
      var caught = false;
      app.on('init', function (cb) {
        if (!caught)
          cb(new Error('whoops'));
        else
          cb();
      });
      app.init(function (err) {
        assert(err);
        assert.equal(err.message, 'whoops');
        caught = true;
        done();
      });
    });
  });


  /****************************************************************************/
  describe('configuration', function () {
    before(function () {
      app.on('init', function (cb) {
        var prefix = app.conf.get('prefix');
        app.prefix = function (str) {
          return prefix + str;
        };
        cb();
      });
    });

    it('uses default conf specified like a plugin should', function (done) {
      app.conf.add({
        prefix: 'wuzzup '
      });
      app.init(function (err) {
        assert.ifError(err);
        assert.equal(app.prefix('world'), 'wuzzup world', 'The prefix was not added correctly');
        done();
      });
    });

    it('uses configuration specified with `app.conf().set`', function (done) {
      app.conf.set('prefix', 'hi ');
      app.init(function (err) {
        assert.ifError(err);
        assert.equal(app.prefix('world'), 'hi world', 'The prefix was not added correctly');
        done();
      });
    });
  });

  /****************************************************************************/
  describe('http plugin', function () {
    before(function (done) {
      app.conf.add({http: {port: port, silent: true}});
      require(app.plugins.http);
      app.init(function () {
        app.http.on('request', function (req, res) {
          res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
          res.end('hello world');
        });
        done();
      });
    });

    after(function (done) {
      app.http.close(done);
    });

    it ('can respond to a request', function (done) {
      request.get('http://localhost:' + port + '/', function (res) {
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['content-type'], 'text/plain; charset=utf-8');
        assert.equal(res.text, 'hello world');
        done();
      });
    });
  });

  /****************************************************************************/
  describe('middleware plugin', function() {
    before(function (done) {
      require(app.plugins.middleware);

      app.init(function () {
        app.middleware.add(function(req, res, next) {
          res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
          res.end('hello world');
        });
        done();
      });
    });

    after(function(done) {
      app.http.close(done);
    });

    it ('can respond to a request', function(done) {
      request.get('http://localhost:' + port + '/', function(res) {
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['content-type'], 'text/plain; charset=utf-8');
        assert.equal(res.text, 'hello world');
        done();
      });
    });
  });

  /****************************************************************************/
  describe('static plugin', function() {
    before(function() {
      require(app.plugins.static);
    });

    afterEach(function(done) {
      app.http.close(done);
    });

    it('can serve static files from default root', function(done) {
      app.init(function (err) {
        assert.ifError(err);
        request.get('http://localhost:' + port + '/', function(res) {
          assert.equal(res.statusCode, 200);
          assert.equal(res.headers['content-type'], 'text/html');
          assert.equal(res.text, 'hello world');
          done();
        });
      });
    });

    it('can serve static files from an alternative root', function(done) {
      app.conf.set('static:path', './public-alt');
      app.init(function(err) {
        assert.ifError(err);
        request.get('http://localhost:' + port + '/hello.txt', function(res) {
          assert.equal(res.statusCode, 200);
          assert.equal(res.headers['content-type'], 'text/plain');
          assert.equal(res.text, 'world');
          done();
        });
      });
    });

    it('can serve static files from an absolute root', function(done) {
      var root = path.join(__dirname, 'public-alt');
      app.conf.set('static:path', root);
      app.init(function(err) {
        assert.ifError(err);
        request.get('http://localhost:' + port + '/hello.txt', function(res) {
          assert.equal(res.statusCode, 200);
          assert.equal(res.headers['content-type'], 'text/plain');
          assert.equal(res.text, 'world');
          done();
        });
      });
    });

    it('can serve a 404', function(done) {
      app.init(function(err, app) {
        assert.ifError(err);
        request.get('http://localhost:' + port + '/nothere', function(res) {
          assert.equal(res.statusCode, 404);
          done();
        });
      });
    });
  });

  /****************************************************************************/
  describe('controllers plugin', function () {
    before(function (done) {
      require(app.plugins.controllers);

      app.on('init', function () {
        var controller = app.controller();
        controller.get('/posts', function (req, res, next) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('list posts');
        });
        controller.post('/posts', function (req, res, next) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('create new post');
        });
        app.controllers.push(controller);
      });

      app.init(done);
    });

    after(function (done) {
      app.http.close(done);
    });

    it ('get /posts', function (done) {
      request.get('http://localhost:' + port + '/posts', function (res) {
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['content-type'], 'text/plain');
        assert.equal(res.text, 'list posts');
        done();
      });
    });

    it ('post /posts', function (done) {
      request.post('http://localhost:' + port + '/posts', function (res) {
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['content-type'], 'text/plain');
        assert.equal(res.text, 'create new post');
        done();
      });
    });
  });

});