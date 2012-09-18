var Cantina = require('../').Cantina,
    request = require('superagent'),
    assert = require('assert');

describe('http plugin', function() {
  var port = 5000, app;

  before(function(done) {
    app = new Cantina({http: {port: port, silent: true}});
    app.use('http');
    app.init(function(err, app) {
      if (err) throw err;

      app.http.on('request', function(req, res) {
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
