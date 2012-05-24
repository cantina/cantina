/**
 * {{{title}}}: Home Controller.
 */

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
 * Serve the '/' route.
 */
function index() {
  this.res.end('{{title}}')
}
