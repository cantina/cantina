/**
 * Cantina: App - Application Controller
 */
module.exports = function(app) {

  /**
   * Constructor.
   */
  function Application() {

  };

  /**
   * Index action.
   */
  Application.prototype.index = function() {
    this.res.end('Hello, World!');
  };

  return Application;
};
