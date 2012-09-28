var app = require('../../')
  , controller = module.exports = app.controller()
  , parseUrl = require('url').parse
  , resolve = require('path').resolve

// Activate a sub-controller when ?alt is in the URL
var altController = app.controller();
app.controllers.load(resolve(__dirname, '../controllers-alt'), altController);
controller.add(function (req, res, next) {
  var query = parseUrl(req.url, true).query;
  if (typeof query.alt !== 'undefined') {
    altController.handler(req, res, next);
  }
  else {
    next();
  }
});

controller.get('/posts', function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('list posts');
});

controller.post('/posts', function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('create new post');
});