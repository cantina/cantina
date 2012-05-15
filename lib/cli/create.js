/**
 * Scaffolding for cantina apps and services.
 */

var path = require('path'),
    prompt = require('prompt'),
    hardhat = require('hardhat');

// Export the CLI command.
var create = module.exports = function(type, cb) {
  var app = this;

  prompt.message = 'cantina'.green;
  prompt.delimiter = ': ';

  prompt.log = function(msg) {
    msg = msg || '';
    console.log(prompt.message + prompt.delimiter + msg);
  }

  if (typeof type === 'function') {
    cb = type;
    type = false;
  }

  if (!type) {
    prompt.start();
    prompt.get([{
      name: 'type',
      message: 'What type? [app/service]',
      validator: /^(app|service)$/,
      warning: 'Please choose a valid type',
      default: 'app',
      empty: false
    }], function(err, result) {
      create.types[result.type].call(app, cb);
    });
  }
  else {
    if (create.types[type]) {
      prompt.start();
      create.types[type].call(app, cb);
    }
    else {
      app.log.error('The type `' + type + '` does not exist');
    }
  }
};

create.types = {};

// Scaffold an application.
create.types.app = function(done) {
  var app = this;
  prompt.get([{
    name: 'type',
    message: 'What type of app? [http/cli]',
    validator: /^(http|cli)$/,
    warning: 'Please choose a valid type',
    default: 'http',
    empty: false
  }, {
    name: 'name',
    message: 'Name your app (for package.json)',
    default: 'my-app',
    empty: false
  }, {
    name: 'description',
    message: 'Describe your app',
    default: 'My App',
    empty: false
  }], function(err, results) {
    if (results.type == 'http') {
      var src = path.join(app.root, 'scaffolds/app-http');
      hardhat.scaffold(src, process.cwd(), {data: results}, function(err) {
        if (err) throw err;
        prompt.log('Created an http application.');
        done();
      });
    }
    else if (results.type == 'cli') {
      prompt.log('Created a cli application.');
      done();
    }
  });
};

// Scaffold a service.
create.types.service = function(done) {
  var app = this;
  prompt.get([{
    name: 'name',
    message: 'Name your service',
    default: 'my-service',
    empty: false
  }, {
    name: 'title',
    message: 'Title your service',
    default: 'My Service',
    empty: false
  }, {
    name: 'description',
    message: 'Describe your service'
  }], function(err, results) {
    var src = path.join(app.root, 'scaffolds/service');
    hardhat.scaffold(src, process.cwd(), {data: results}, function(err) {
      if (err) throw err;
      prompt.log('Created a a service.');
      done();
    });
  });
};
