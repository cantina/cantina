utils
======

Exposes utility functions and modules on `app.utils`.

Provides
--------
- **app.utils.~** - All of the methods in the node.js core 'util' module.
- **app.utils.async** - The [async](https://github.com/caolan/async) module.
- **app.utils.glob** - The [glob](https://github.com/isaacs/node-glob) module.
- **app.utils.clone** - The [clone](https://github.com/pvorb/node-clone) module.
- The custom methods listed below...

Methods
-------
### app.utils.defaults([deep], obj, defaults)
Extend an object with defaults.

- **[deep]** {Boolean} If true, performs a deep (recursive) merge. Optional.
- **obj** {Object} The object to extend.
- **defaults** {Object} An object containing the defaults.

Example
-------
```js
var app = require('cantina');

app.setup(function(err) {
  if (err) return console.error(err);

  // Use the utils.
  var defaults = {
    color: 'green',
    size: 'small'
  };

  var shape = {
    type: 'circle'
  };

  app.utils.defaults(shape, defaults);

  console.log(shape);
  // { color: 'green', size: 'small', type: 'circle' }
});
```