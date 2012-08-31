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

// You can pass configuration here (though the preferred location is ./etc)
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

Plugins
-------
Plugins are modules that export specific meta-data and methods that
Cantina uses to bootstrap your application.

### Plugin properties & methods (* required)
- **name**: * A unique name for your plugin. Only one instance of each plugin can
  exist on an application.
- **version**: * A semver to identify your plugin's version.
- **init**: * `function(app, done)` The initialization callback for your plugin.
- **dependencies**: A hash of plugins that your plugin depends on. Same format as
  `dependencies` in package.json.
- **defaults**: Default configuration for your plugin.
- **error**: `function(err, app)` A handler to bind to application 'error' events.
- **ready**: `function(app, done)` A handler to run when all plugins have been
  attached to the app. Asynchronous.

### Example
```js
module.exports = {

  name: 'graphtastic',
  version: '0.3.1',

  dependencies: {
    'db': '~0.3.0',
    'math': '>= 1.0.0',
    'draw': '1.3.37'
  },

  defaults: {
    width: 400,
    height: 200,
  },

  init: function(app, done) {
    var conf = app.conf.get('graphtasitc'),
        db = app.db,
        math = app.math,
        draw = app.draw;

    app.graphtastic = {

      chart: function(headers, data) {
        // Render a chart or something.
        // Maybe using conf.width and conf.height.
      },

      graph: {
        pie: function(labels, data) {
          // Render a pie chart.
        },

        bar: function(labels, data) {
          // REnder a bar chart.
        }
      }

    };

    done();
  },

  error: function(err, app) {
    console.log('Something went wrong', err);
  },

  ready: function(app, done) {
    console.log('Sweet the app is initialized');
    done();
  },

};
```

Available Plugins
-----------------
<table>
  <thead><tr><th>Name</th><th>Repo</th><th>Description</th></tr></thead>
  <tr>
    <td>cantina-auth</td>
    <td>https://github.com/cantina/cantina-auth/tree/1.x</td>
    <td>Wraps <a src="passport">https://github.com/jaredhanson/passport</a> to provide authentication for your app</td>
  </tr>
  <tr>
    <td>cantina-buffet</td>
    <td>https://github.com/cantina/cantina-buffet]</td>
    <td>Wraps <a src="buffet">http://github.com/carlos8f/buffet</a> to provide static file serving</td>
  </tr>
  <tr>
    <td>cantina-http</td>
    <td>https://github.com/cantina/cantina-http</td>
    <td>Provides an http server for your app</td>
  </tr>
  <tr>
    <td>cantina-middler</td>
    <td>https://github.com/cantina/cantina-middler</td>
    <td>Provides a middleware layer for your app via <a src="middler">http://github.com/carlos8f/middler</a></td>
  </tr>
  <tr>
    <td>cantina-session</td>
    <td>https://github.com/cantina/cantina-session/tree/1.x</td>
    <td>Adds connect-sesison powered sessions with a redis store to your app</td>
  </tr>
  <tr>
    <td>cantina-views</td>
    <td>https://github.com/cantina/cantina-views/tree/1.x</td>
    <td>Wraps <a src="views">github.com/cpsubrian/views</a> to provide template rendering and partials</td>
  </tr>
</table>

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



