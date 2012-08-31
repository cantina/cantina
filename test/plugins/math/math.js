
exports.imports = {
  "add": "*",
  "subtract": "*"
};

exports.defaults = {
  "incr": 10
};

exports.init = function(conf, imports, register) {
  register(null, {
    add: imports.add,
    subtract: imports.subtract,
    incr: function(num) {
      return imports.add(num, conf.incr);
    }
  });
};
