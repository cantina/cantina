var app = require('../../');
var controller = module.exports = app.controller();

controller.get('/posts', function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('list alt posts');
});

controller.post('/posts', function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('create new alt post');
});