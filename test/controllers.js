var Cantina = require('../').Cantina,
    request = require('superagent'),
    assert = require('assert');

describe('controllers plugin', function() {
  var port = 5000, app;

  before(function(done) {
    var posts = {
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
      }    };

    app = new Cantina({http: {port: port, silent: true}});

    app.use('http');
    app.use('middleware');
    app.use('controllers');
    app.use(posts);

    app.init(done);
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
