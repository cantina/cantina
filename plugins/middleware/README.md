cantina-middler
===============

[Middler](https://github.com/carlos8f/node-middler/) plugin for [Cantina](https://github.com/cantina/cantina)

Dependencies
------------
- **http** - An http server provided by the [http plugin](https://github.com/cantina/cantina/tree/1.x/plugins/http)

Provides
--------
- **app.middler** - The middler module, for use by other plugins.
- **app.middleware** - A middler instance.

Example
-------
```js
var app = require('cantina');

app.load(function(err) {
  if (err) return console.error(err);

  // Load plugins.
  require(app.plugins.http);
  require(app.plugins.middleware);

  // Custom plugin conf.
  app.conf.set('http', {
    port: 3000,
    silent: true
  });

  // Initialize the app.
  app.init(function(err) {
    if (err) return console.error(err);

    // Use the middleware.
    app.middleware.add(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end('hello world');
    });
  });
});
```