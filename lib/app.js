/**
 * Stub docs for the cantina `app` instance.
 *
 * @module cantina
 */

/**
 * Cantina application instance
 * ----------------------------
 *
 * Presuming you created your cantina application in 'http' mode (the default),
 * the `app` instance is an http flatiron app.  A ton of functionality is
 * inherited from flatiron and cantina extends it with some more.
 *
 * Probably the most basic cantina app is an http server that responds to a
 * '/' route.
 *
 *     var cantina = require('cantina');
 *
 *     var app = cantina.createApp({
 *       name: 'my-app',
 *       description: 'My App',
 *       version: '0.1.0',
 *       amino: false, // Amino is for clustered apps, turn it off.
 *       host: 'localhost', // Optional, this is the default host.
 *       port: 8080 // Optional, this is the default port
 *     });
 *
 *     app.router.get('/', function() {
 *       this.res.html('<h1>My App</h1><p>Welcome to my awsome app!</p>');
 *     });
 *
 *     app.start();
 *
 * @class app
 */


