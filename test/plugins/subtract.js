module.exports = {
  name: 'subtract',
  provides: ['subtract'],
  init: function(conf, imports, register) {
    register(null, {
      subtract: function(a, b) {
        return a - b;
      }
    });
  }
};
