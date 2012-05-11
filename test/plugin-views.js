/**
 * Tests for the views plugin.
 */

var assert = require('assert'),
    cantina = require('../'),
    amino = require('amino');

describe('Plugin: Views', function() {
  var app, i = 0, currentName;

  beforeEach(function(done) {
    app = cantina.createApp({
      root: __dirname,
      name: 'cantina-test-plugin-views-' + (i++),
      version: '0.0.1',
      silent: true
    });
    app.use(cantina.plugins.views, {
      path: 'fixtures/views'
    });
    app.start(done);
  });

  it('should be able to render templates with data', function(done) {
    app.router.get('hello', function() {
      this.render('hello', {name: 'Leonardo'});
    })
    amino.request('amino://' + app.info.name + '/hello', function(err, res, body) {
      assert.ifError(err);
      assert.equal(body, '<html><body><h1>Hello Leonardo</h1></body></html>', 'template was rendered incorrectly');
      done();
    });
  });

  it('should be able to render templates with static helpers', function(done) {
    app.viewHelper({name: 'Donatello'});
    app.router.get('hello', function() {
      this.render('hello');
    });
    amino.request('amino://' + app.info.name + '/hello', function(err, res, body) {
      assert.ifError(err);
      assert.equal(body, '<html><body><h1>Hello Donatello</h1></body></html>', 'template was rendered incorrectly');
      done();
    });
  });

  it('should be able to render templates with dynamic helpers', function(done) {
    app.viewHelper(function(done) {
      done(null, {name: 'Michelangelo'});
    });
    app.router.get('hello', function() {
      this.render('hello');
    });
    amino.request('amino://' + app.info.name + '/hello', function(err, res, body) {
      assert.ifError(err);
      assert.equal(body, '<html><body><h1>Hello Michelangelo</h1></body></html>', 'template was rendered incorrectly');
      done();
    });
  });

  it('should be able to render templates with no layout', function(done) {
    app.router.get('hello', function() {
      this.render('hello', {name: 'Raphael', layout: false});
    })
    amino.request('amino://' + app.info.name + '/hello', function(err, res, body) {
      assert.ifError(err);
      assert.equal(body, '<h1>Hello Raphael</h1>', 'template was rendered incorrectly');
      done();
    });
  });

});