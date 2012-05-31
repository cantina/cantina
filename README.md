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
TODO: Update this if we publish cantina to npm.

Scaffolding
-----------
Cantina provides a command-line utility to help you quickly set up our preferred
application structure.  There is no 'right' way to use Cantina, be we like
consistency between our applications.

### Setup ###
Until cantina is hosted through npm, you'll need to manually install a global
copy of cantina on your machine, as well as sym-link the binary to somewhere
in your $PATH. `/usr/local/bin/` will work in most cases.

### Usage ###
To see usage instructions for cantina, run the `cantina` script.
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
`cantina create` or `cantina create <type>` will jump you into he scaffolding
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

Usage
----------------------------
The first thing you'll want to do with Cantina is create your application
instance.

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
  - So, `app` is also a broadway app.
  - `app` has a [director](https://github.com/flatiron/director)
    router attached as `app.router`.
  - Unless overriden, info from your package.json will be used to fill in
    default options such as 'name', 'version' as well as the absolute path
    to your application's root directory (`app.root`).
  - Some cantina core plugins have already been attached (via `app.use()`)
    including: 'http', 'middleware' and 'utils'.  See full plugin docs below.








