/**
 * Cantina Plugins Plugin
 * ----------------------
 *
 * Facilitates sugary syntax for loading and attaching cantina plugins to
 * cantina apps.
 *
 * @module cantina
 * @exports {Object} The plugins plugin.
 */

/**
 * Plugins Plugin
 * --------------
 *
 * Facilitates sugary syntax for loading and attaching cantina plugins to
 * cantina apps.
 *
 * @class cantina.plugins.plugins
 */
var plugins = module.exports = {
  name: 'plugins',
  description: 'Streamlined plugin loading.'
};

/**
 * Attach the plugin to an application.
 *
 * Overrides `app.use()` with some optional syntactical sugar.  Allows cantina
 * apps to attach plugins like:
 *
 *     app.use('controllers', {[options]});
 *
 * The above syntax will only work if the named plugin has been registered
 * on `cantina.plugins` (most cantina plugins register themselves if required).
 */
plugins.attach = function(options) {
  var app = this,
      cantina = options.cantina;

  // Save a reference to the broadway implementation of app.use().
  app._use = app.use;

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
   * @param plugin {Object|String} The plugin, or the name of a cantina plugin,
   *   to attach.
   * @param [options] {Object} Options to pass to he plugin durring attachment.
   * @param [callback] {Function} A callback to invoke after the plugin is
   *   attached.
   * @for app
   */
  app.use = function(plugin, options, callback) {
    options = options || {};
    callback = callback || undefined;

    if (typeof plugin === 'string') {
      if (cantina.plugins[plugin]) {
        return app._use(cantina.plugins[plugin], options, callback);
      }
      else {
        try {
          var loaded = app.require('cantina-' + plugin);
          if (cantina.plugins[plugin]) {
            return app._use(cantina.plugins[plugin], options, callback);
          }
          else if (loaded.plugin) {
            return app._use(loaded.plugin, options, callback);
          }
          else if (loaded.attach) {
            return app._use(loaded, options, callback);
          }
          else {
            throw new Error('Could not find or load the plugin: ' + plugin);
          }
        }
        catch (ex) {
          console.error('Error requiring the plugin: ' + plugin);
          throw ex;
        }
      }
    }
    else {
      return app._use(plugin, options, callback);
    }
  };
}
