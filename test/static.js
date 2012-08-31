var cantina = require('../'),
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
    var plugins = ['http', 'middleware', 'static'];
    var conf = {http: {port: port, silent: true}};
    app = cantina.createApp(plugins, conf, function(err, app) {
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
    var plugins = ['http', 'middleware', 'static'];
    var conf = {http: {port: port, silent: true}, static: {root: 'public-alt'}};
    app = cantina.createApp(plugins, conf, function(err, app) {
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
    var plugins = ['http', 'middleware', 'static'];
    var root = path.join(__dirname, 'public-alt');
    var conf = {http: {port: port, silent: true}, static: {root: root}};
    app = cantina.createApp(plugins, conf, function(err, app) {
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
    var plugins = ['http', 'middleware', 'static'];
    var conf = {http: {port: port, silent: true}};
    app = cantina.createApp(plugins, conf, function(err, app) {
      assert.ifError(err);
      request.get('http://localhost:' + port + '/nothere', function(res) {
        assert.equal(res.statusCode, 404);
        done();
      });
    });
  });

});
