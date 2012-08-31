
exports.dependencies = {
  "add": "*",
  "subtract": "*"
};

exports.defaults = {
  "incr": 10
};

exports.init = function(app, done) {
  var conf = app.conf.get('math');
  app.math = {
    add: app.add,
    subtract: app.subtract,
    incr: function(num) {
      return app.add(num, conf.incr);
    }
  };
  done();
};
