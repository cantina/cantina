Cantina
=======

An opinionated application framework built on-top of, and compatible with,
[flatiron](http://flatironjs.org/).

Optionally, empower your application with clustered scalability via
[amino](https://github.com/cantina/amino).

Super Basic Example
-------------------
```
var cantina = require('cantina'),
    app = cantina.app;

    app.router.get('/', function() {
      this.res.end('Hello, world!');
    });

    app.start();

    // Now hit http://localhost:8080 in your browser.
```

This is a simple web-server that responds to requests to '/'.  Nothing here is
very far beyond what flatiron offers.  For more value read on.

Table of Contents
-----------------
  - [About/Why](#aboutwhy)
  - [Installation](#installation)
  - [Scaffolding](#scaffolding)
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [Create your app](#create-your-app)
    - [Using plugins](#using-plugins)
    - [Using connect middleware](#using-connect-middleware)
  - [Amino](#amino)
  - [Plugins](#plugins)
    - [Core plugins](#core-plugins)
    - [Cantina platform plugins](#cantina-platform-plugins)
  - [Services](#services)
  - [Running the Tests](#running-the-tests)
  - [Contributing](#contributing)

About/Why?
----------

While evaluating [all](http://expressjs.com/) the [various](http://geddyjs.org/)
node.js web [frameworks](https://github.com/mikeal/tako) out there
we quickly fell in love with the pluggability and customizability of
flatiron.  In particular, we wanted to take advantage of the way
[broadway](https://github.com/flatiron/broadway) presents a simple api for
extending applications with 'plugins'.

After playing with some simple, bare, flatiron http applications we
quickly discovered that we were repeating a lot of boilerplate code.  We also
found ourselves longing for a few bits and pieces from other frameworks, such
as a configurable views system and automatic 'controller' loading.

Embracing broadway as our plugin architecture, we started to create reusable
components to facilitate our application structure and workflow.

Installation
------------
Util cantina is hosted through npm, the easiest way to use it in your app is to
include it in your package.json as a dependency like:

```
  "dependencies": {
    "cantina": "git+ssh://git@github.com:cantina/cantina.git"
  },
```

Then runnning `npm install` will check out the lastest version into your
`node_modules/` folder.

Alternatively, you may decide to clone Cantina into your global `node_modules` and
sym-link the bin script so you can use the scaffolding utility.  On unix-like
machines you might do something similar to:

```
$ cd /usr/local/lib/node_modules

$ git clone git@github.com:cantina/cantina.git
Cloning into 'cantina'...
remote: Counting objects: 532, done.
remote: Compressing objects: 100% (246/246), done.
remote: Total 532 (delta 254), reused 502 (delta 224)
Receiving objects: 100% (532/532), 63.68 KiB | 53 KiB/s, done.
Resolving deltas: 100% (254/254), done.

$ cd cantina

$ npm install

$ ln -s /usr/local/lib/node_modules/cantina/bin/cantina /usr/local/bin/cantina

```

Scaffolding
-----------
Cantina provides a command-line utility to help you quickly set up our preferred
application structure.  There is no 'right' way to use Cantina, be we like
consistency between our applications.

To see current usage instructions run the `cantina` script.
```
$ cantina
help:
help:   Usage: cantina <command>
help:
help:   where <command> is one of:
help:       create
help:
```

#### create ####
`cantina create` or `cantina create <type>` will jump you into the scaffolding
utility.  You'll be prompted for information about your app/service/plugin
and then the appropriate folders and files will be copied into your current
working directory.

Step 1: Create your application directory
```
$ mkdir my-app
$ cd my-app
```

Step 2: Run the scaffolding utility, providing any requested details.
```
$ cantina create
cantina: What type? [app/plugin/service] (app): app
cantina: What type of app? [http/cli] (http):
cantina: Name your app (for package.json) (my-app):
cantina: Describe your app (My App):
cantina: Created an http application.
```

Quick Start
-----------
As a quick exercise, we'll walk you through creating the 'app'
scaffolding, starting up your app, visiting it in your browser, and making a
small addition to the home view.

#### Step 1: Run the app scaffolding: ####
```
$ mkdir app

$ cd app

$ cantina create app
cantina: Name your app (for package.json) (my-app):
cantina: Describe your app (My App):
cantina: Would you like to use Amino? [yes/no] (yes): no
cantina: Created an http application.
```
Note: I answered 'no' to Amino, since we don't need it for this example.

#### Step 2: Start you app ####
```
$ npm install

$ npm start
```
Note: The default port is `8080`, but you can overide this by running:
`$ ./bin/app --port=9090` instead of `npm start`.

#### Step 3: Visit the app in your browser ####
Goto [http://localhost:8080](http://localhost:8080) to visit your app.

Kinda boring?  Lets make a few quick tweaks.

#### Step 4: Make a few edits ####
First we'll edit the app title.  Open `lib/app.js` in your editor of choice.
Find the code block where the views helper is being defined and change the
title to something a little more interesting like:

```js
// lib/app.js

// [file contents ...]

// Views helper.
app.views.helper({
  title: 'Super Awesome Webpage 2.0'
});
```

You just edited a 'static' views helper.  They allow you make app-level data
available to all templates.  Lets say we want to make something dynamic
available like the current date (stupid, I know).  Add a dynamic helper below
the existing static one like:

```js
// Dynamic views helper.
app.views.helper(function(callback) {
  // Note: This function will be called in the 'router' scope, so this.req,
  // this.res, and this.app are available.

  // Provide the current date.
  callback(null, {date: new Date().toString()});
});
```

Now we need to add the date to our template.  Open up `lib/views/index.hbs` and
edit its contents to match:

```html
<h1>{{title}}</h1>
<h3>{{date}}</h3>
<p>{{content}}</p>
```

Now re-start your app and refresh your browser to see the changes.


Usage
------
The easiest way to get started is to use the scaffolding utility, but if going
the manual route, the first thing you'll want to do with Cantina is create
your application instance.

### Create your app ###

```js
var cantina = require('cantina');
var app = cantina.app;
```

This will result an application with all the default options.  To override
options use:

```js
var app = cantina.createApp({
  mode: 'cli',
  name: 'my-amazing-cli-app',
  ...
});
```

Some things to note about `app` (assuming you are using the default `http` mode):

  - `app` is a [flatiron](http://flatironjs.org/) app.
  - `app` is also a [broadway](https://github.com/flatiron/broadway) app.
  - `app` has a [director](https://github.com/flatiron/director)
    router attached as `app.router`.
  - Unless overriden, info from your package.json will be used to fill in
    default options such as 'name', 'version' as well as the absolute path
    to your application's root directory (`app.root`).
  - Some cantina core plugins have already been attached (via `app.use()`)
    including: 'http', 'middleware' and 'utils'.  See full plugin docs below.

### Using plugins ###
While you are welcome to fill up your `app.js` with as much logic as you like,
the main idea behind Cantina is to divide functionality into independent plugins.
'Plugins' follow the broadway spec (so please reference their docs for more info).

Loading a plugin into your app is as simple as:

```js
app.use(cantina.plugins.controllers);
```

Many plugins accept options, so for example to override some of the controller
plugin's defaults you might do:

```js
app.use(cantina.plugins.controllers, {
  path: 'controllers' // The default is 'lib/controllers'
});
```

### Using connect middleware ###
Flatiron's http server (which Cantina inherits from) is built on the
[union](https://github.com/flatiron/union) middleware kernel.  Union is
fully backwards compatiple with [connect](https://github.com/senchalabs/connect).

Cantina exposes an easy method of attaching middleware via `app.middleware()`.
So, for example if you wanted to use connect's popular static middleware to
serve your public assets you could do the following:

```js
var cantina = require('cantina'),
    connect = require('connect'),
    app = cantina.app;

app.middleware(connect.static('public'));
```

Note: Part of the Cantina platform is [cantina-static](https://github.com/cantina/cantina-static)
which exposes connect's static middleware with some sane defaults and dependency
checking. You can use it like:

```js
app.use(require('connect-static').plugin);
```

Amino
-----
[Amino](http://github.com/cantina/amino) is a 'clustered application creation
toolkit'.  Though not a requirement for using cantina, many cantina services
& plugins have been developed with amino in mind, or specifically for amino.

In a nutshell, amino is a means for node.js services to talk with each other
through several different protocols (mainly pub/sub, queue/process, and
request/reply).  Amino takes all the hard work out of load-balancing,
failover, and management of the hosts and ports in your cluster.

Some cantina services require amino while others provide fallbacks.  For example
the standard cantina http app assumes you want to run an amino service, however
you can opt-out of amino via its options:

```js
var app = cantina.createApp({amino: false});
```
Please check out amino and its docs for more info.

Plugins
-------
As mentioned in [Usage](#usage), plugins are the primary means for organizing
and re-using code in your cantina applications.  Cantina plugins follow the
[broadway](https://github.com/flatiron/broadway) spec and go through its
standard life-cycle of `attach`, `init`, and `detach`.  Plugins have access to
the `app` instance via scope binding.

Some typical patterns for plugins might include:

  - Exposing new methods and api's on the `app` instance.  For example, cantina
    ships with a 'middlware' plugin that exposes the `app.middleware()` method.
  - Binding route handlers via `app.router` (in this way plugins can be treated
    like controllers).
  - Adding middleware to the app via `app.middleware`.  For example,
    [cantina-static](http://github.com/cantina/cantina-static) adds connect's
    static middleware with some sane defaults and dependency checking.

### 'Core' Plugins ###
Cantina ships with a handful of plugins that seemed essential to most
applications.  Please be aware that with future versions of cantina some
of these plugins may be moved to their own projects.

  - **cantina.plugins.http** -
    The http plugin handles setting up a flatiron http application with or without
    amino support.  It is loaded by default in all cantina apps.  Any options passed
    in during attachment (`app.use()`) will be passed through to flatiron.

    If you are NOT using amino, you can override the default host and port
    via command line arguments (`--port=9090 --host=1.1.1.1`) or plugin options:

    ```js
    var app = cantina.createApp({
      host: '1.1.1.1',
      port: 9090
    });
    ```

  - **cantina.plugins.middleware** -
    Adds a convenient method for attaching middleware to your application.  You
    may register route-sentitive middleware via optional parameters like:

    ```js
    function loadUser(req, res, next) {
      // load a user from a database or something.
      // ...
      req.user = user;
      next();
    };

    app.middleware('GET', 'users/*', loadUser);
    ```

  - **cantina.plugins.controllers** -
    Given a folder containing 'controller' plugins, this plugin loads them all
    and provides some syntactic sugar for specifiying router handlers.

    Assuming your application hierarchy looks something like:

    ```
    app/
      bin/
      lib/
        controllers/
          home.js <----- a controller plugin
        views/
        app.js
      public/
      ...
    ```

    ... and if the contents of `home.js` are:

    ```js
    /* home.js */

    // Define the controller.
    exports.name: 'home';
    exports.description: 'Home Controller';

    // Routes to be auto-mounted.
    // Note: This is a director 'routing table'.
    exports.routes = {
      '/': { get: index }
    };

    // Index route handler.
    function index() {
      this.render('index', 'Welcome to my application!');
    }
    ```

    ... then `cantina.plugins.controllers` will auto-load `home.js` and mount the
    exported routing table.  You may add as many controller plugins in the
    `controllers/` directory as you like.

  - **cantina.plugins.utils** -
    Utility functions mostly used internally, but might be usefull in your app
    or plugins.  The utility functions can be accessed via `cantina.plugins.utils`
    or via `app.utils` (the utils plugin both exports the methods as well as
    attaches itself to the application instance).

      - `app.utils.defaults(obj, properties)` - Extend an object with default
        poperties.
      - `app.utils.lazy(obj, [root,] paths)` - Expose node.js modules as lazy-loaded
        properties on an object.  `obj` with be extended with the properties and
        `paths` should be an array of module paths.  `root` can optionally be
        specified which allows the `paths` to be relative to it.
      - `app.utils.parseUrl(url)` - A cached version of the node.js core url.parse
        method.

### Cantina platform plugins ###
These plugins are part of the cantina platform:

  - **[cantina-static](http://github.com/cantina/cantina-static)** -
    Serve static assets via connect's static middleware.

  - **[cantina-views](http://github.com/cantina/cantina-views)** -
    Adds a full-featured views system to your cantina application.  Register views
    namespaces, register views partials, and render views with your favorite
    templating engine. `cantina-views` is built with [consolidate.js](https://github.com/visionmedia/consolidate.js.git)
    which, as of this writing, supports 14 different template engines.

    `cantina-views` was developed with plugins in mind, so your plugins can easily
    add their own views and partials that the main application can render or
    reference.

  - **[cantina-auth](http://github.com/cantina/cantina-auth)** -
    Adds [passport](https://github.com/jaredhanson/passport.git)-based
    authentication to your cantina application.

  - **[cantina-socketio](http://github.com/cantina/cantina-socketio)** -
    Adds [socket.io](https://github.com/learnboost/socket.io) support to your
    cantina application.

### Create your own plugin ###
The `cantina` command-line utility can help you quickly set up the struture for
a new plugin.  Just run:

```
$ cantina create plugin
```

... and provide the neccesary plugin details.

Services
--------
TODO: Describe what a service is and when they should be used.

### Available Services ###
TODO: List all known services and what they do, linking to their repos for more
info.

### Create you own service ###
TODO: Show how to run the service scaffolding and what you might want to do
with it.

Running the Tests
-----------------
TODO: Describe how to run the tests.  Note: Right now they require a working
amino setup (redis).

Contributing
------------
TODO: Describe what belongs in cantina core vs external plugins/services.
How to contribute?  How to get your cantina-compatible plugins/services
listed here?
