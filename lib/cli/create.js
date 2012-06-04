/**
 * CLI command 'create'
 *
 * Provides scaffolding for various cantina use-cases.
 *
 * @module cantina
 * @exports {Function} CLI callback for the 'create' command.
 * @requires path, prompt, hardhat, utils, fs
 */

// Module dependencies
var path = require('path'),
    prompt = require('prompt'),
    hardhat = require('hardhat'),
    utils = require('../plugins/utils.js'),
    fs = require('fs');

/**
 * The 'create' command.
 *
 * @method create
 * @param [type] {String} The type of scaffolding to create.  Can be one of:
 *
 *   - `app`: An application with a start script, public dir, views, dir, etc.
 *   - `service`: A service with a start script, service app, and a plugin.
 *   - `plugin`: A simple application plugin.
 *
 * @param callback {Function} Will be called when the command is complete.
 * @return null
 * @for cantina.cli
 * @async
 */
var create = module.exports = function(type, callback) {
  var app = this;

  prompt.message = 'cantina'.green;
  prompt.delimiter = ': ';

  prompt.log = function(msg) {
    msg = msg || '';
    console.log(prompt.message + prompt.delimiter + msg);
  }

  if (typeof type === 'function') {
    callback = type;
    type = false;
  }

  if (!type) {
    prompt.start();
    prompt.get([{
      name: 'type',
      message: 'What type? [app/plugin/service]',
      validator: /^(app|plugin|service)$/,
      warning: 'Please choose a valid type',
      default: 'app',
      empty: false
    }], function(err, result) {
      create.types[result.type].call(app, callback);
    });
  }
  else {
    if (create.types[type]) {
      prompt.start();
      create.types[type].call(app, callback);
    }
    else {
      app.log.error('The type `' + type + '` does not exist');
    }
  }
};

/**
 * Add some default data for the scaffolding templates.
 */
create.defaults = function(data) {
  var pkg = require('../../package.json');
  utils.defaults(data, {
    cantina_ver: pkg.version,
    node_ver: pkg.engines.node,
  });
};

// Scaffolding types.
create.types = {};

/**
 * Scaffold an application.
 */
create.types.app = function(done) {
  var app = this;
  prompt.get([{
    name: 'name',
    message: 'Name your app (for package.json)',
    default: 'my-app',
    empty: false
  }, {
    name: 'description',
    message: 'Describe your app',
    default: 'My App',
    empty: false
  }, {
    name: 'amino',
    message: 'Would you like to use Amino? [yes/no]',
    validator: /^(yes|no)$/,
    warning: 'Please choose a valid option',
    default: 'yes',
    empty: false
  }], function(err, results) {
    var src = path.join(app.root, 'scaffolds/app');
    create.defaults(results);
    results.amino = (results.amino === 'yes') ? true : false;
    hardhat.scaffold(src, process.cwd(), {data: results}, function(err) {
      if (err) throw err;
      fs.chmodSync(path.join(process.cwd(), 'bin/app'), '774');
      prompt.log('Created an http application.');
      done();
    });
  });
};

/**
 * Scaffold a plugin.
 */
create.types.plugin = function(done) {
  var app = this;
  prompt.get([{
    name: 'name',
    message: 'Name your plugin',
    default: 'my-plugin',
    empty: false
  }, {
    name: 'title',
    message: 'Title your plugin',
    default: 'My Plugin',
    empty: false
  }, {
    name: 'description',
    message: 'Describe your plugin'
  }], function(err, results) {
    var src = path.join(app.root, 'scaffolds/plugin');
    create.defaults(results);
    hardhat.scaffold(src, process.cwd(), {data: results}, function(err) {
      if (err) throw err;
      prompt.log('Created a plugin.');
      done();
    });
  });
};

/**
 * Scaffold a service.
 */
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
  }, {
    name: 'amino',
    message: 'Would you like to use Amino? [yes/no]',
    validator: /^(yes|no)$/,
    warning: 'Please choose a valid option',
    default: 'yes',
    empty: false
  }], function(err, results) {
    var src = path.join(app.root, 'scaffolds/service');
    create.defaults(results);
    results.amino = (results.amino === 'yes') ? true : false;
    hardhat.scaffold(src, process.cwd(), {data: results}, function(err) {
      if (err) throw err;
      fs.chmodSync(path.join(process.cwd(), 'bin/service.js'), '774');
      prompt.log('Created a service.');
      done();
    });
  });
};
