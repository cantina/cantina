module.exports = {
  name: 'subtract',
  version: "0.0.1",
  init: function(conf, imports, register) {
    register(null, function(a, b) {
      return a - b;
    });
  }
};
