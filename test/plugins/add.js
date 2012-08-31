module.exports = {
  name: 'add',
  version: "0.0.1",
  init: function(conf, imports, register) {
    register(null, function(a, b) {
      return a + b;
    });
  }
};
