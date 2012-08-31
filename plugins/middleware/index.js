var middler = require('middler');

module.exports = {

  "name": "middleware",
  "version": require('../../package.json').version,

  "dependencies": {
    "http": "~1.0.0"
  },

  init: function(app, done) {
    app.middler = middler;
    app.middleware = app.middler(app.http);
    done();
  }
};
