var app = require('../../');

// Setup the app. Loads configuration, locates the application root, and loads
// default core plugins (utils).
app.setup(function(err) {
  if (err) return console.log(err);

  // Load plugins.
  require(app.plugins.http);
  require(app.plugins.middleware);
  require(app.plugins.static);

  // Initialize the app. Runs all plugin 'init' listeners, then runs all
  // 'ready' listeners.
  app.init();
});
