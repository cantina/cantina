Cantina 2.x
===========

A node.js application framework that leverages the power of a shared event
emitter, a simple plugin pattern, and a flexible configuration engine.

Example
-------
```js
var app = require('cantina');

// Load the application
// --------------------
// 1. Locates your application root directory (so plugins can reference it).
// 2. Creates an `etc` configuration object and loads configuration from a
//    variety of default sources.
// 3. Loads default core plugin(s): utils
app.load(function(err) {
  // Handle load errors.
  if (err) return console.log(err);

  // Optionally, add default configuration.
  // (a better practice is to put your configuration in `./etc/conf.json`)
  app.conf.add({
    http: {
      host: 'localhost',
      port: 8080
    },
    static: {
      path: './public'
    },
    myplugin: {
      time: 5000
    }
  });

  // Optionally, handle errors (by default they output with `console.error`).
  app.on('error', function(err) {
    // Save the error to your logs or something.
  });

  // Load plugins
  // ------------
  // Core plugins:
  require(app.plugins.http);
  require(app.plugins.middleware);
  require(app.plugins.controllers);
  require(app.plugins.static);
  // External plugins:
  require('cantina-views');
  // Local plugins:
  require('./plugins/myplugin');

  // Initialize your application
  // ---------------------------
  // 1. Runs all 'init' event listeners asynchronously, in order.
  // 2. Runs all 'ready' event listeners asynchronously, in order.
  // 3. Optionally, you can respond to initialization errors with a callback.
  app.init();
});

```

Installation
------------
Until cantina is hosted through npm, the easiest way to use it in your app is to
include it in your package.json as a dependency like:

```
  "dependencies": {
    "cantina": "git+ssh://git@github.com:cantina/cantina.git#2.x"
  },
```

Then runnning `npm install` will check out the lastest version into your
`node_modules/` folder.

Plugins
-------
Cantina plugins use `require('cantina')` to access to the `app` event emitter.
Plugins can really do whatever they want, however, there are a few conventions
that can be followed in order to cooperate with the application initialization
process.

### Example Plugin
```js
var app = require('cantina');

// Add some default configuration options.
app.conf.add({
  square: {
    color: 'red',
    height: 200
  },
  circle: {
    color: 'blue',
    radius: 4
  }
});

// Bind to application events, such as 'error', or custom ones that your
// application uses.
app.on('create:circle', function(options) {
  var defaults = app.conf.get('circle');
  var circle = {
    color: options.color || defaults.color,
    radius: options.radius || defaults.radius
  };
  app.shapes.circles.push(circle);
});

// Register an 'init' listener. Commonly used to attach functionality to the
// app or to initialize application namespaces.
app.on('init', function() {
  app.shapes = {
    squares: [],
    circles: []
  };
});

// Register a 'ready' listener. All plugins will be initialized and their APIs
// will be available for use.
//
// Note: Both 'init' and 'ready' events can use a continuation callback if their
// logic is asynchronous.
app.on('ready', function(callback) {
  app.db.loadCircles(function(err, circles) {
    if (err) return callback(err);
    circles.forEach(function(circle) {
      app.emit('create:circle', circle);
    });
    callback();
  });
});
```

Core Plugins
------------
Cantina ships with a few core plugins that most web-apps need to get started.

<table>
  <thead><tr><th>Name</th><th>Description</th></tr></thead>
  <tr>
    <td><a href="https://github.com/cantina/cantina/tree/2.x/plugins/http">http</a></td>
    <td>Provides an http server for your app</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina/tree/2.x/plugins/middleware">middleware</a></td>
    <td>Provides a middleware layer for your app via <a href="http://github.com/carlos8f/node-middler">middler</a></td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina/tree/2.x/plugins/static">static</a></td>
    <td>Provides static file serving for you app via <a href="http://github.com/carlos8f/node-buffet">buffet</a></td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina/tree/2.x/plugins/controllers">controllers</a></td>
    <td>Route URL paths to your app logic</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina/tree/2.x/plugins/utils">utils</a></td>
    <td>Exposes `app.utils` which is a collection of useful methods and third-party modules.</td>
  </tr>
</table>

Available Plugins
-----------------
Other plugins are available either as part of the cantina family or from 3rd parties.

<table>
  <thead><tr><th>Module</th><th>Description</th></tr></thead>
  <tr>
    <td><a href="https://github.com/cantina/cantina-auth">cantina&#8209;amino</a></td>
    <td>Wraps <a href="https://github.com/amino/amino">amino</a> to provide automatic clustering to your app</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-auth">cantina&#8209;auth</a></td>
    <td>Wraps <a href="https://github.com/jaredhanson/passport">passport</a> to provide authentication for your app</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-auth-dummy">cantina&#8209;auth&#8209;dummy</a></td>
    <td>Provides dummy authentication for use in benchmarks and testing</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-auth-facebook">cantina&#8209;auth&#8209;facebook</a></td>
    <td>Provides support for authentication via Facebook</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-auth-freedomworks">cantina&#8209;auth&#8209;freedomworks</a></td>
    <td>Provides support for authentication via FreedomWorks</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-auth-twitter">cantina&#8209;auth&#8209;twitter</a></td>
    <td>Provides support for authentication via Twitter</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-engine.io">cantina&#8209;engine.io</a></td>
    <td>Wraps <a href="https://github.com/carlos8f/engine.oil">engine.oil</a> to provide engine.io support for your app</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-model">cantina&#8209;model</a></td>
    <td>Provides a basic Model class to build from</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-redis">cantina&#8209;redis</a></td>
    <td>Provides an [haredis](https://github.com/carlos8f/haredis) client, RedisModel, RedisCollection, and RedisView classes.</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-session">cantina&#8209;session</a></td>
    <td>Adds connect-sesison powered sessions with a redis store to your app</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-user">cantina&#8209;user</a></td>
    <td>Provides a simple user model to kick-start your app.</td>
  </tr>
  <tr>
    <td><a href="https://github.com/cantina/cantina-views">cantina&#8209;views</a></td>
    <td>Wraps <a href="https://github.com/cpsubrian/node-views">views</a> to provide template rendering and partials</td>
  </tr>
</table>

Configuration
-------------
An important function of Cantina is to centralize your app's configuration.

Cantina delegates to [node-etc](https://www.github.com/cpsubrian/node-etc)
to handle many different configuration sources. When you call `app.load()` the
following sources will be automatically checked and loaded (by order of
precedence):

1. **argv** - Command-line arguments parsed by optimist.
2. **env** - Environment variables that match the prefix: 'app_'
3. **./etc/** - JSON, JS, and YAML files in `[app root]/etc` will be parsed and
   added to the config. If the filename is `config.*` then the contents will be
   merged in at the root level of the config. Any other files are assumed to
   be plugin specific and will be merged into conf keyed by filename.
4. **package.json** - If your package.json contains an `etc` key it will be
   merged into the conf.

After `app.load()` has finished, you can add more configuration either in your
application or in plugins via `app.conf.add`, `app.conf.set`, or any other
means of adding configuration that **etc** exposes.

Most applications should just store their configuration in `./etc` and rely
on plugin defaults and argv for the rest.

Use Events, Silly
-----------------
Events should be your go-to solution for organizing and implementing your
application logic. To that end, Cantina uses [EventFlow](https://github.com/cpsubrian/node-eventflow)
internally to handle flow control for the `init` and `ready` events. You can
use it in your plugins too!

EventFlow exposes `app.series`, `app.parallel`, and `app.invoke`: three
powerful ways to use special kinds of event listeners. Head on over to the
EventFlow docs to learn more.

More Examples
-------------
Sample applications an be found in the [./examples](https://github.com/cantina/cantina/tree/2.x/examples)
folder.

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



