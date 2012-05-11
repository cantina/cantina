/**
 * Confirm that the application correctly starts up an amino service.
 */

var assert = require('assert'),
    cantina = require('../'),
    amino = require('amino');

describe('Amino', function() {
  var app;

  before(function(done) {
    app = cantina.createApp({
      root: __dirname,
      name: 'cantina-test-amino',
      version: '0.0.1',
      silent: true,
    });

    app.router.get('/', function() {
      this.res.end('Test');
    });

    app.start(done);
  });

  after(function(done) {
    app.stop(done);
  });

  it('should respond to requests to `/`', function(done) {
    amino.request('amino://cantina-test-amino/', function(err, res, body) {
      assert.equal(res.body, 'Test', 'The response body matches the expected content');
      done();
    });
  });
});