var buffet = require('buffet');

module.exports = {

  name: "static",
  version: require('../../package.json').version,

  dependencies: {
    "middleware": "~1.0.0"
  },

  defaults: {
    "root": "public",
    "notFound": true
  },

  init: function(app, done) {
    var conf = app.conf.get('static');

    // Resolve root to the app root (still respects absolute paths).
    conf.root = app.resolve(conf.root);

    // Create buffet middleware.
    var buffetMiddleware = buffet(conf.root, conf);

    // Add buffet to middler stack.
    app.middleware.add(buffetMiddleware);

    // Optionally add buffet notFound handler.
    if (conf.notFound) {
      app.middleware.last(buffetMiddleware.notFound);
    }

    app.buffet = buffetMiddleware;
    done();
  }
};
