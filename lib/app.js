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
 * A simple cantina app is an http server that responds to a '/' route.
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
var app = null;

/**
 * Attach a plugin to the application.  Plugins should conform to the following
 * interface:
 *
 *     var plugin = {
 *       "name": "example-plugin", // Plugin's name
 *
 *       "attach": function attach(options) {
 *         // Called with plugin options once plugin attached to application
 *         // `this` - is a reference to application
 *       },
 *
 *       "detach": function detach() {
 *         // Called when plugin detached from application
 *         // (Only if plugin with same name was attached)
 *         // `this` - is a reference to application
 *       },
 *
 *       "init": function init(callback) {
 *         // Called on application initialization
 *         // App#init(callback) will be called once every plugin will call `callback`
 *         // `this` - is a reference to application
 *       }
 *     };
 *
 * @method use
 * @param plugin {object} The plugin to attach.
 * @param [options] {Object} Options to pass to he plugin durring attachment.
 * @for app
 */
app.use = function(plugin, options) {};

/**
 * The application's director router instance.
 *
 * See [http://github.com/flatiron/director](http://github.com/flatiron/director)
 * for mor detailed documentation.
 *
 * @property router
 * @type {director.Router}
 * @for app
 */
app.router = {};

/**
 * The application's HTTP/HTTPS server instance.
 *
 * @property server
 * @type {http.Server}
 * @for app
 */
app.server = {};

