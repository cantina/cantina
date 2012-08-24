module.exports = function(conf, imports, register) {
  register(null, {
    math: {
      add: imports.add,
      subtract: imports.subtract,
      incr: function(num) {
        return imports.add(num, conf.incr);
      }
    }
  });
};
