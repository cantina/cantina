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
var conf = {
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
An important function of Cantina is to centralize your app's configuration.

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

Most applications should just store their configuration in `./etc` and rely
on plugin defaults and argv for the rest.

Plugins
-------
Plugins are modules that export specific meta-data and methods that
Cantina uses to bootstrap your application.

### Example
```js
// myplugin.js

exports.name = 'myplugin';
exports.consumes = ['db'];
exports.provides = ['awesomesauce'];

exports.defaults: {
  message: 'Awesome!!!!'
};

exports.init = function(conf, imports, register) {
  // conf contains plugin settings merged from all relevant sources.

  // Use stuff you consume.
  var db = imports.db;

  // If your plugin encounters fatal error conditions return them with register.
  if (db.type !== 'nosql') {
    return register(new Error('You used a relational database!!!'));
  }

  // Register services provided by your plugin.
  register(null, {
    awesomesauce: function() {
      console.log(conf.message);
    }
  });
};

exports.error = function(err, app) {
  console.log('Something broke!');
};

```

### Plugin properties & methods (* required)
- **name** *: A unique name for your plugin. Only one instance of each plugin can
  exist on an application.
- **init** *: The initialization callback for your plugin.
- **consumes**: An array of service names that your plugin depends on.
- **provides**: An array of service names that your plugin provides.
- **defaults**: Default configuration for your plugin.
- **error**: A handler to bind to application 'error' events.
- **ready**: A handler to bind to application 'ready' events.
- **close**: A handler to bind to application 'close' events.

Example implementation of all plugin properties:
```js
module.exports = {

  name: 'myplugin',

  consumes: ['db', 'math', 'draw'],

  provides: ['chart', 'graph'],

  defaults: {
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

Available Plugins
-----------------
Coming soon!

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



