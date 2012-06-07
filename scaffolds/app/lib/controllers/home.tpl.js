/**
 * Home controller.
 */

// Define the controller.
var home = module.exports = {
  name: 'home',
  description: 'Home Controller'
};

// Routes to be auto-mounted.
home.routes = {
  '/': { get: index }
};

/**
 * Index route controller.
 */
function index() {
  this.render('index', '{{description}}');
}