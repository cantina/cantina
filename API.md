Cantina API
===========

Though most applications will only need to use `cantina.createApp()`, the entire
cantina API is exposed through the Cantina class.

### cantina.createApp(plugins, [conf], [callback])
- `plugins`: An array of plugin paths. Paths should resolve to modules or
  files that define plugins. The order is significant. Cantina will
  re-order the plugins if it needs to in order to resolve dependencies, but
  if you take care to account for dependencies then you can be sure the plugins
  will be loaded in order. This can be criticial if, for example, you are
  using a few different plugins that add middleware to an http server.

  Example: `['cantina-http', 'cantina-middler', 'cantina-buffet']`

- `conf`: (Optional) An object containing configuration for your application.
  Most apps should take advantage of alternative configuration strategies such
  as putting your configuration in `./etc`, however if you wish to add some
  config in your application code it can go here. The configuration should be
  keyed by plugin name.

  Example: `{http: {host: 'localhost', port: 8080}, buffet: {path: 'public'}}`

- `callback`: (Optional) A callback (`function (err, app) {} `) to fire after the
  plugins have been attached and the app is initialized.

- **Returns** `app`: The application instance.

**Example**
```js
var cantina = require('cantina');
var plugins = ['cantina-http', 'cantina-middler', 'cantina-buffet'];
var conf = {
  http: { host: 'localhost', port: 8080 },
  buffet: {path: 'public', maxAge: 6000 }
};
cantina.createApp(plugins, conf, function(err, app) {
  // Respond to initialization.  Generally this will be pretty empty
  // because your plugins should be doing all the interesting stuff.
});
```

### Cantina class
In addition to `createApp()`, cantina exports the main application class: `Cantina`.
If you need or want to work with the application more dynamically than
`createApp` allows, you can create and interact with an instance of Cantina.

**Create an app manually**
```js
var Cantina = require('cantina').Cantina;
var app = new Cantina();
```

### Cantina([conf]) - Constructor
When constructing an application instance, you can optionally pass plugin
configuration to use.

### Events
During the life-cycle of an application, serveral events are emitted.

**service**: A plugin service was just initialized.
```js
app.on('service', function(name) {
  console.log('Service attached: ' + name);
  console.log(app.services[name]);
});
```

**plugin**: A plugin was just initialized.
```js
app.on('plugin', function(plugin) {
  console.log('Attached: ' + plugin.name);
  console.log(plugin);
});
```

**ready**: All plugins have finished initializing.
```js
app.on('ready', function(app) {
  // Fully initialized app instance.
});
```

**error**: An error occured.
```js
app.on('error', function(err, app) {
  // Respond to the error.
});
```

**destroy**: Triggered by `app.destroy()`. This event is most useful to plugins
that need to preform a cleanup routine if the app is destroyed. Read more about
plugin event binding in the 'Plugins' section.
```js
app.on('destroy', function(app) {
  // Clean up some stuff
});
```

### app.use(plugin, [conf])
Add a plugin to the application. It will not be initialized until `app.init()`
is called.

- `plugin`: The name of a plugin module, the path to a plugin module (can be relative),
  or a plugin object.

- `conf`: (Optional) Plugin-specific configuration. This takes precedence over all
  other configuration.

**Examples**
```js
// Use a plugin module.
app.use('cantina-http');

// Use a local plugin module.
app.use('./plugins/myplugin');

// Use a plugin that was already loaded.
var plugin = {
  name: 'myplugin',
  consumes: [ ... ],
  provides: [ ... ],
  init: function(conf, imports, register) { ... }
};
app.use(plugin);
```

### app.remove(name)
Remove an uninitialized plugin. Generally, MUST be called before `app.init()`.

- `name`: The name of the plugin to remove.

### app.init()
Initialize all plugins. Your app MUST listen for the 'error' event and you
probably also want to listen for 'ready'.

**Example**
```js
app.init();
app.on('error', function(err) {
  // Do something
});
app.on('ready', function(app) {
  // Do something else
});
```

### app.destroy()
Destroy the app and allow plugins to perform cleanup if they are listening for
the 'destroy' event.
