/**
 * Routing table for the application.
 */
module.exports = function(app) {
  return {
    '/': {
      // Supports controller#action syntax.
      get: 'Application#index'
    },
    '/help': {
      // Or just put your functions here.
      get: function() {
        this.res.end('Here is some help.');
      }
    }
  };
};