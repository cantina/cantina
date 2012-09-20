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
// app.js

var app = require('cantina');

app.load(function(err) {
  if (err) return console.error(err);

  require(app.plugins.http);
  require(app.plugins.middleware);
  require(app.plugins.controllers);
  require('./plugins/controllers/posts');

  app.init();
});
```

```js
// ./plugins/controllers/posts.js

var app = require('cantina');

app.on('init', function() {
  var controller = app.controller();
  controller.get('/posts', function (req, res, next) {
    // list posts
  });
  controller.post('/posts', function (req, res, next) {
    // create a new post
  });
  app.controllers.push(controller);
});
```