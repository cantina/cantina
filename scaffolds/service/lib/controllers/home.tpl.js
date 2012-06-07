/**
 * {{{title}}}: Home Controller.
 */

// Define the controller.
var home = module.exports = {
  name: 'home',
  description:'Home Controller'
};

// Define routes.
home.routes = {
  '/': {
    get: index
  }
};

/**
 * Serve the index route.
 */
function index() {
  this.res.end('{{title}}')
}
