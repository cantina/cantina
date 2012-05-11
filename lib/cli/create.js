/**
 * Scaffolding for cantina apps and services.
 */

var path = require('path'),
    prompt = require('prompt');

// Export the CLI command.
var create = module.exports = function(type, cb) {
  prompt.message = 'cantina';
  prompt.delimiter = ': ';

  if (typeof type === 'function') {
    cb = type;
    type = false;
  }

  function done() {
    console.log('');
    cb();
  }

  if (!type) {
    prompt.start();
    prompt.get([{
      name: 'type',
      message: 'What type? [app/service/plugin]',
      validator: /^(app|service|plugin)$/,
      warning: 'Please choose a valid type',
      default: 'app',
      empty: 'false'
    }], function(err, result) {
      console.log('');
      create.types[result.type](done);
    });
  }
  else {
    if (create.types[type]) {
      create.types[type](done);
    }
    else {
      app.log.error('The type `' + type + '` does not exist');
    }
  }
};

create.types = {};

// Scaffold an application.
create.types.app = function(done) {
  console.log('Create an application ...');
  done();
};

// Scaffold a service.
create.types.service = function(done) {
  console.log('Create a service ...');

  done();
};

// Scaffold a plugin.
create.types.plugin = function(done) {
  console.log('Create a plugin ...');

  done();
}