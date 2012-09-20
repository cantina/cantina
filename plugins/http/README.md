cantina-http
============

HTTP plugin for [Cantina](https://github.com/cantina/cantina)

Provides
--------
- **app.http** - An http server.

Configuration
-------------
- **listen** - Automatically start listening.
- **host** - Hostname to open the server on.
- **port** - Port to open the server on.
- **silent** - Do not log any output.

**Defaults**
```js
{
  http: {
    listen: true,
    host: null,
    port: 8080,
    silent: false
  }
}
```

Example
-------
```js
var app = require('cantina');

app.setup(function(err) {
  if (err) return console.error(err);

  // Load http plugin.
  require(app.plugins.http);

  // Custom http config.
  app.conf.set('http', {
    port: 3000,
    silent: true
  });

  // Intialize the app.
  app.init(function(err) {
    if (err) return console.error(err);

    // Use the http server.
    app.http.on('request', function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end('hello world');
    });
  });
});
```