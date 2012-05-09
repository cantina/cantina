/**
 * Test controller: veggie.js.
 *
 * Uses ad-hoc routes.
 */

var veggieController = module.exports = {
  name: 'fruitController',
  description: 'A test controller: fruit.'
};

veggieController.attach = function(options) {
  var app = this;

  app.router.get('/lettuce', function() {
    this.res.end('Hey, you picked lettuce!');
  })
};
