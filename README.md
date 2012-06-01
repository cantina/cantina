Cantina
=======

An opinionated application framework built on-top of, and compatible with,
[flatiron](http://flatironjs.org/).

Optionally, empower your application with clustered scalability via
[amino](https://github.com/cantina/amino).

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
