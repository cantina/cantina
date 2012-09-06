cantina-controllers
===================

Controllers plugin for [Cantina](https://github.com/cantina/cantina)

Dependencies
------------
- **middleware**

Provides
--------
- **app.controller** - Call this function to return a new controller. A controller
  is a [middler](https://github.com/carlos8f/node-middler) instance.
- **app.controllers** - Push controllers onto this array to use them.

Example
-------
```js
var plugins = ['http', 'middleware', 'controllers']

plugins.push({
  name: 'posts',
  dependencies: { controllers: '1.x' },
  init: function (app, done) {
    var controller = app.controller();
    controller.get('/posts', function (req, res, next) {
      // list posts
    });
    controller.post('/posts', function (req, res, next) {
      // create a new post
    });
    app.controllers.push(controller);
    done();
  }
});

require('cantina').createApp(plugins, function (err, app) {
  if (err) return console.log(err);
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