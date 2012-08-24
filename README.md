Cantina
=======

A simple application framework based on plugins, dependency injection, and
flexible configuration.


Example
-------------------
```js
var cantina = require('cantina');

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
cantina.createApp(plugins, conf, function(err, app) {
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

Configuration
-------------
Cantina delegates to [node-etc](https://www.github.com/cpsubrian/node-etc)
to handle many different configuration sources. When you call `cantina.createApp()`
or `new Cantina()`, the following sources will be automatically checked and loaded
(by order or precedence):

1. **app.use()** - Conf passed in app.use takes the highest precedence.
2. **argv** - Command-line arguments parsed by optimist.
3. **env** - Environment variables that match the prefix: 'app_'
4. **conf passed to Constructor or createApp()**
5. **./etc/** - JSON, JS, and YAML fiels in `[app root]/etc` will be parsed and
   added to the config. If the filename is `config.*` then the contents will be
   merged in at the root level of the config. Any other files are assumed to
   be plugin specific and will be merged into conf keyed by filename.
6. **package.json** - If your package.json contains an `etc` key it will be
   merged into the conf.
7. **plugin defailts** If plugins specify default configuration they will be
   the last thing used.

If you wish to interact with the etc configuration object directly you can find it
on `app.conf`.

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


Plugins
-------
A plugin is ultimately just an object that conforms to the Cantina plugin spec.
Generally, plugins will be defined either as a stand-alone node module (with
its own package.json), or as a module local to your application.

**Example**
```js
// package.json
{
  "name": 'MyPlugin',
  "version": '1.0.4',

  // [other package.json stuff]

  // Optional plugin conf.
  "cantina": {
    "consumes": ["db"],
    "privides": ["awesomesauce"],
    "color": "blue"
    // etc.
  },
}
```
```js
// myplugin.js

// Plugin initialization.
exports.init = function(conf, imports, register) {
  // conf contains plugin settings merged from all relevant sources.

  // Use stuff you consume.
  var db = imports.http;

  // If your plugin encounters fatal error conditions return them with register.
  if (db.type !== 'nosql') {
    return register(new Error('You used a relational database!!!'));
  }

  // Register services provided by your plugin.
  register(null, {
    awesomesauce: function() {
      console.log('Awesome!!!');
    }
  });
};

// Handle app errors.
exports.error = function(err, app) {
  console.log('Something broke!');
};

```

### Plugin properties & methods
- **name**: A unique name for your plugin. Only one instance of each plugin can
  exist on an application. (Required)
- **consumes**: An array of service names that your plugin depends on.
- **provides**: An array of service names that your plugin provides.
- **conf**: Default configuration for your plugin.
- **init**: The initialization callback for your plugin. (Required)
- **error**: A handler to bind to application 'error' events.
- **ready**: A handler to bind to application 'ready' events.
- **destroy**: A handler to bind to application 'destroy' events.

Example implementation of all plugin properties:
```js
module.exports = {

  name: 'myplugin',

  consumes: ['db', 'math', 'draw'],

  provides: ['chart', 'graph'],

  conf: {
    width: 400,
    height: 200,
  },

  init: function(conf, imports, register) {
    var db = imports.db,
        math = imports.math,
        draw = imports.draw;

    register(null, {

      // Chart service.
      chart: function(headers, data) {
        // Render a chart or something.
        // Maybe using conf.width and conf.height.
      }

      // Graph service.
      graph: {
        pie: function(labels, data) {
          // Render a pie chart.
        },

        bar: function(labels, data) {
          // REnder a bar chart.
        }
      }

    });
  },

  error: function(err, app) {
    console.log('Something went wrong', err);
  },

  ready: function(app) {
    console.log('Sweet the app is initialized');
  },

  destroy: function(app) {
    // Cleanup temp files or something.
  },

};
```

### Available Plugins ###
Something here.


Credits
-------
Cantina is the net result of our experiments with a number of different frameworks
and plugin systems. These include express, flatiron, broadway, and architect.
Architect, in particular was a tremendous source of influence (and code).
Gratitude goes out to the authors and contributors of those projects for helping
us learn more about node.js and how to structure complex applications.

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT
Copyright (C) 2012 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



