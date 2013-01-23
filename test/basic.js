describe('basic', function () {
  it('works', function (done) {
    var app = require('../');
    app.on('init', function (cb) {
      cb();
    });
    app.emit('init', done);
  });
});