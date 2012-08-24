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

Quick Start
-----------
Something here.

Usage
------
Something here.

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


