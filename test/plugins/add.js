module.exports = {
  name: 'add',
  version: "0.0.1",
  init: function(app, done) {
    app.add = function(a, b) {
      return a + b;
    };
    done();
  }
};
