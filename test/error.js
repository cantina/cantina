var cantina = require('../'),
    request = require('superagent'),
    assert = require('assert');

describe('error', function() {
  var port = 5000, app;

  it('catches init error', function (done) {
    cantina.createApp([{
      name: 'init-error-test',
      init: function (app, cb) {
        cb(new Error('whoops'));
      }
    }], function (err, app) {
      assert(err);
      assert.equal(err.message, 'whoops');
      done();
    });
  });

  it('catches runtime error', function (done) {
    cantina.createApp([{
      name: 'runtime-error-test',
      init: function (app, cb) {
        app.on('error', function (err) {
          assert.equal(err.message, 'geez');
          done();
        });
        setTimeout(function () {
          app.emit('error', new Error('geez'));
        }, 100);
      }
    }], assert.ifError);
  });
});
