var cantina = require('../'),
    request = require('superagent'),
    assert = require('assert');

describe('controllers plugin', function() {
  var port = 5000, app;

  before(function(done) {
    var plugins = ['http', 'middleware', 'controllers'];

    plugins.push({
      name: 'posts',
      dependencies: { controllers: '~1.0' },
      init: function (app, done) {
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
        done();
      }
    });

    var conf = {http: {port: port, silent: true}};
    app = cantina.createApp(plugins, conf, function(err, app) {
      if (err) throw err;
      done();
    });
  });

  after(function(done) {
    app.http.close(done);
  });

  it ('get /posts', function(done) {
    request.get('http://localhost:' + port + '/posts', function(res) {
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['content-type'], 'text/plain');
      assert.equal(res.text, 'list posts');
      done();
    });
  });

  it ('post /posts', function(done) {
    request.post('http://localhost:' + port + '/posts', function(res) {
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['content-type'], 'text/plain');
      assert.equal(res.text, 'create new post');
      done();
    });
  });
});
