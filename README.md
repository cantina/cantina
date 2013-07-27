Cantina
=======

A node.js application framework that leverages the power of a shared event
emitter, a simple plugin pattern, and a flexible configuration engine.

**Current Version:** `3.x`

Example
-------
```js
var app = require('cantina');

// Boot the application
// --------------------
// 1. Locates your application root directory (so plugins can reference it).
// 2. Creates an `etc` configuration object and loads configuration from a
//    variety of default sources.
// 3. Loads default core plugin(s): utils
app.boot(function(err) {
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

  // Handle errors.
  app.on('error', function(err) {
    // Save the error to your logs or something.
  });

  // Load plugins
  // ------------
  // To load a 'plugin' you just require it.
  //
  // A helper, app.load(dir), is available if you just want to load a whole
  // directory of plugin modules.

  // Start the application
  // ---------------------
  // 1. Runs all 'start' hooks asynchronously, in series.
  // 2. Runs all 'started' hooks asynchronously, in parallel.
  // 3. Optionally, you can respond to initialization errors with a callback.
  app.start();
});

```

Installation
------------
Until cantina is hosted through npm, the easiest way to use it in your app is to
include it in your package.json as a dependency like:

```
  "dependencies": {
    "cantina": "git+ssh://git@github.com:cantina/cantina.git#3.x"
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

// Expose data or an API on the app.
app.shapes = {
  squares: [],
  circles: []
};

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

// Add a 'start' hook.
// Hooks run asynchronously, so if you setup requires hitting a database or doing
// other asynchronous work, you should do that here.
app.hook('start').add(function (next) {
  app.db.loadCircles(function(err, circles) {
    if (err) return next(err);
    circles.forEach(function(circle) {
      app.emit('create:circle', circle);
    });
    next();
  });
});

// Add a 'destroy' hook.
app.hook('destroy').add(function (next) {
  // Clean-up if the app is destroyed.
  next();
})
```

Configuration
-------------
An important function of Cantina is to centralize your app's configuration.

Cantina delegates to [node-etc](https://www.github.com/cpsubrian/node-etc)
to handle many different configuration sources. When you call `app.boot()` the
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

After `app.boot()` has finished, you can add more configuration either in your
application or in plugins via `app.conf.add`, `app.conf.set`, or any other
means of adding configuration that **etc** exposes.

Most applications should just store their configuration in `./etc` and rely
on plugin defaults and argv for the rest.

Events and Hooks
-----------------
Events and hooks should be your go-to solutions for organizing and implementing
application logic. Use `app.on()` and `app.emit()` when you want to deal with
synchronous tasks. `app.hook()` exposes an api for registering asynchronous
tasks. It is powered by [stact-hooks](https://github.com/cpsubrian/node-stact-hooks).

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)

Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Santa Cruz, CA and Washington, D.C.

- - -

### License: MIT

Copyright (C) 2013 Terra Eclipse, Inc. ([http://www.terraeclipse.com](http://www.terraeclipse.com))

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



