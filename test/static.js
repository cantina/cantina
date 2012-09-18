var Cantina = require('../').Cantina,
    request = require('superagent'),
    assert = require('assert'),
    path = require('path');

describe('static plugin', function() {
  var port = 5000, app;

  afterEach(function(done) {
    app.http.close(function() {
      app = null;
      done();
    });
  });

  it('can serve static files from default root', function(done) {
    app = new Cantina({http: {port: port, silent: true}});
    app.use('http');
    app.use('middleware');
    app.use('static');
    app.init(function(err, app) {
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
    app = new Cantina({http: {port: port, silent: true}, static: {root: 'public-alt'}});
    app.use('http');
    app.use('middleware');
    app.use('static');
    app.init(function(err, app) {
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
    app = new Cantina({http: {port: port, silent: true}, static: {root: root}});
    app.use('http');
    app.use('middleware');
    app.use('static');
    app.init(function(err, app) {
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
    app = new Cantina({http: {port: port, silent: true}});
    app.use('http');
    app.use('middleware');
    app.use('static');
    app.init(function(err, app) {
      assert.ifError(err);
      request.get('http://localhost:' + port + '/nothere', function(res) {
        assert.equal(res.statusCode, 404);
        done();
      });
    });
  });

});
