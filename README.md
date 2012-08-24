Cantina
=======

A simple application framework based on plugins, dependency injection, and
flexible configuration.


Example
-------------------
```js
// Plugins define imports and exports and the load order is automatically
// determined to sort out depenencies.
var plugins = [
  'cantina-http',
  'cantina-middler',
  './plugins/myplugin',
  './plugins/myotherplugin'
];

// A number of different configuration setups are supported, one of which
// is passing config in manually.
var config = {
  http: {
    host: 'localhost',
    port: 8080
  },
  myplugin: {
    time: 5000
  }
};

// Create the application.
require('cantina').createApp(plugins, conf, function(err, app) {
  if (err) return console.log(err);

  // Do something with the app, maybe.
});
```

About/Why?
----------
After using and evaluating a few different application frameworks, some key
points became clear:

- A giant framework that does everything you need is great for getting started,
  but bad for high performance custom applications.
- Building your application around a collection of small, fast, tested modules
  is the way to go.
- Flatiron is a solid framework, but across the board its modules are
  trying to do too much for our taste (for example, Director supports both
  server-side and client-side routing).
- A simple plugin system can aid in breaking apart application logic. Broadway
  was a really good start, but we tired of working with a big bloated `app`
  object.
- Architect brought to light a really clever way of managing dependencies
  between plugins, but it didnt support the type of configuration and app
  structure we wanted.

So we created a simple system that pulls together plugins who explicitly
declare their dependencies and exports, added a flexible configuration
layer, and called it 'Cantina'.

Installation
------------
Until cantina is hosted through npm, the easiest way to use it in your app is to
include it in your package.json as a dependency like:

```
  "dependencies": {
    "cantina": "git+ssh://git@github.com:cantina/cantina.git"
  },
```

Then runnning `npm install` will check out the lastest version into your
`node_modules/` folder.

API
---
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

#### Example
```js
var cantina = require('cantina');
var plugins = ['cantina-http', 'cantina-middler', 'cantina-buffet'];
var conf = {
  http: { host: 'localhost', port: 8080 },
  buffet: {path: 'public', maxAge: 6000 }
};
var app = cantina.createApp(plugins, conf, function(err, app) {
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

- **service**: A plugin service was just initialized.
```js
app.on('service', function(name) {
  console.log('Service attached: ' + name);
  console.log(app.services[name]);
});
```

- **plugin**: A plugin was just initialized.
```js
app.on('plugin', function(plugin) {
  console.log('Attached: ' + plugin.name);
  console.log(plugin);
});
```

- **ready**: All plugins have finished initializing.
```js
app.on('ready', function(app) {
  // Fully initialized app instance.
});
```

- **error**: An error occured.
```js
app.on('error', function(err, app) {
  // Respond to the error.
});
```

- **destroy**: Triggered by `app.destroy()`. Mostly useful for plugins to bind
  to in case some cleanup is needed.


Plugins
-------
Something here.

### Available Plugins ###
Something here.

### Create your own plugin ###
Something here.

Credits
-------
Cantina is the net result of our experiments with a number of different frameworks
and plugin systems. These include express, flatiron, broadway, and architect.
Architect, in particular was a tremendous source of influence (and code).
Gratitude goes out to the authors and contributors of those projects for helping
us learn more about node.js and how to structure complex applications.


