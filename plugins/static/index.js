var app = require('../../'),
    buffet = require('buffet'),
    path = require('path');

app.conf.add({
  static: {
    'root': './public',
    'notFound': true
  }
});

app.on('init', function () {
  var conf = app.conf.get('static');

  // Resolve root to the app root.
  conf.root = path.resolve(app.root, conf.root);

  // Create buffet middleware.
  var buffetMiddleware = buffet(conf.root, conf);

  // Add buffet to middler stack.
  app.middleware.add(buffetMiddleware);

  // Optionally add buffet notFound handler.
  if (conf.notFound) {
    app.middleware.last(buffetMiddleware.notFound);
  }

  app.buffet = buffetMiddleware;
});
