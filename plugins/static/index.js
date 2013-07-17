var app = require('../../'),
    buffet = require('buffet'),
    path = require('path');

app.conf.add({
  static: {
    'path': './public',
    'notFound': true
  }
});

var conf = app.conf.get('static');

// Resolve root to the app root.
var rootPath = path.resolve(app.root, conf.path);

// Create buffet middleware.
var buffetMiddleware = buffet(rootPath, conf);

// Add buffet to middler stack.
app.middleware.add(buffetMiddleware);

// Optionally add buffet notFound handler.
if (conf.notFound) {
  app.middleware.last(buffetMiddleware.notFound);
}

app.buffet = buffet;
