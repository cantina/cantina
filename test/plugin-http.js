/**
 * Confirm that the application correctly starts http services.
 */

var assert = require('assert'),
    cantina = require('../'),
    amino = require('amino');

describe('Plugin: HTTP', function() {
  var app;

  describe('via Amino', function() {
    // Spin up a fresh app.
    before(function(done) {
      app = cantina.createApp({
        root: __dirname,
        name: 'cantina-test-plugin-http-amino',
        version: '0.0.1',
        silent: true,
      });
      app.router.get('/', function() {
        this.res.end('Test Amino');
      });
      app.start(done);
    });

    after(function(done) {
      app.stop(true, done);
    });

    it('should respond to requests to `/`', function(done) {
      amino.request('amino://' + app.info.name + '/', function(err, res, body) {
        assert.equal(res.body, 'Test Amino', 'The response body matches the expected content');
        done();
      });
    });
  });


  describe('via HTTP', function() {
    // Spin up a fresh app.
    before(function(done) {
      app = cantina.createApp({
        root: __dirname,
        name: 'cantina-test-plugin-http-http',
        version: '0.0.1',
        silent: true,
        amino: false,
      });
      app.router.get('/', function() {
        this.res.end('Test HTTP');
      });
      app.start(9090, done);
    });

    it('should respond to requests to `/`', function(done) {
      amino.request('http://localhost:9090/', function(err, res, body) {
        assert.equal(res.body, 'Test HTTP', 'The response body matches the expected content');
        done();
      });
    });
  });
});
