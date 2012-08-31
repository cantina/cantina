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
  root: 'public',
  notFound: true
}
```

Example
-------
```js
var cantina = require('cantina'),
    plugins = ['http', 'middleware', 'static'],
    conf = { http: {port: 3000}, static: {root: 'public', maxAge: 500, gzip: true} };

cantina.createApp(plugins, conf, function(err, app) {
  if (err) return console.log(err);
  // The buffet middleware is now serving your static files.
});
```

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
