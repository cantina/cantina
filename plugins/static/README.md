static
======

[Buffet](https://github.com/carlos8f/node-buffet/) plugin for [Cantina](https://github.com/cantina/cantina)

Dependencies
------------
- **middler** - A middler instance provided by the [middleware plugin](https://github.com/cantina/cantina/tree/1.x/plugins/middleware)

Provides
--------
- **app.buffet** - A buffet middleware handler.

Adds Middleware
---------------
- **buffet middleware** - Serves static files.
- **buffet notFound** - Serves 404's (added via `middler.last()`);

Configuration
-------------
- **root** - Root path to your static files. Can be relative to your application
  root or absolute. Examples: `public`, `../static`, `/var/www/html`.
- **notFound** - Add buffet's notFound middleware to the bottom of the middler stack.
- ... Any other buffet options you want to set. See buffet's readme for more info.

**Defaults**
```js
{
  static: {
    root: 'public',
    notFound: true
  }
}
```

Example
-------
```js
var app = require('cantina');

app.setup(function(err) {
  if (err) return console.error(err);

  // Load plugins.
  require(app.plugins.http);
  require(app.plugins.middleware);
  require(app.plugins.static);

  // Custom conf.
  app.conf.set({
    http: {
      port: 3000
    },
    static: {
      root: './public',
      maxAge: 500,
      gzip: true
    }
  });

  // Initialize the app.
  app.init(function(err) {
    if (err) return console.error(err);
    // The buffet middleware is now serving your static files.
  });
});
```