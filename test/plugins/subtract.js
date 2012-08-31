module.exports = {
  name: 'subtract',
  version: "0.0.1",
  init: function(app, done) {
    app.subtract = function(a, b) {
      return a - b;
    };
    done();
  }
};
