Cantina
=======

An opinionated application framework built on-top of, and compatible with,
[flatiron](http://flatironjs.org/).

Optionally, empower your application with clustered scalability via
[amino](https://github.com/cantina/amino).

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

Step 2: Run the scaffolding utility, providing the requested information.
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
TODO: Describe how to run the app scaffolding, npm install, start the app,
and hit it in the browser.  Also show how to add a route to the home
controller that uses a custom view.

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

  - `app` is a flatiron app.
  - `app` is also a broadway app.
  - `app` has a [director](https://github.com/flatiron/director)
    router attached as `app.router`.
  - Unless overriden, info from your package.json will be used to fill in
    default options such as 'name', 'version' as well as the absolute path
    to your application's root directory (`app.root`).
  - Some cantina core plugins have already been attached (via `app.use()`)
    including: 'http', 'middleware' and 'utils'.  See full plugin docs below.

### Using plugins ###
TODO: Describe how to do this.

### Using connect middleware ###
TODO: Describe how to do this.

Amino
-----
TODO: Quick intro to amino and how it effects Cantina apps/services.

Plugins
-------
TODO: Describe what a plugin is and why they should be used.

### Available Plugins ###
TODO: List all known plugins and what they do, linking to their repos for more
info.

### Create your own plugin ###
TODO: Show how to run the plugin scaffolding and what you might want to do with
it.

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
