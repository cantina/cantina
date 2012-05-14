/**
 * Home controller.
 */

var home = module.exports = {
  name: 'home',
  description: 'Home Controller'
};

// Setup the routes.
home.routes = {
  '/': { get: index }
};

// Index.
function index() {
  this.render('index', '{{description}}');
}