module.exports = {
  name: 'add',
  provides: ['add'],
  init: function(conf, imports, register) {
    register(null, {
      add: function(a, b) {
        return a + b;
      }
    });
  }
};
