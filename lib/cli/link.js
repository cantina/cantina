/**
 * CLI command to 'npm link' all amino and cantina dependencies in the cwd.
 *
 * @module cantina
 */

var path = require('path'),
    exec = require('child_process').exec,
    utils = require('cantina-utils');

/**
 * The 'link' command.
 *
 * @method link
 * @param callback {Function} Will be called when the command is complete.
 * @return null
 * @for cantina.cli
 * @async
 */
module.exports = function(callback) {
  var cwd = process.cwd(),
      tasks = [],
      json,
      modules;

  if (path.existsSync(cwd + '/package.json')) {
    json = require(cwd + '/package.json');
    if (json.dependencies) {
      // Join dependencies and devDependencies.
      modules = Object.keys(json.dependencies);
      if (json.devDependencies) {
        modules = modules.concat(Object.keys(json.devDependencies));
      }

      // Setup async tasks.
      modules.forEach(function(module) {
        if (module.match(/(amino)|(cantina)/)) {
          console.log('Linking: ' + module);
          tasks.push(function(done) {
            exec('rm -Rf ' + cwd + '/node_modules/' + module, function(err) {
              if (err) console.log(err);
              exec('npm link ' + module, function(err) {
                if (err) console.log(err);
                done();
              });
            });
          });
        }
      });

      // Run the tasks.
      utils.async.parallel(tasks, function(err, results) {
        console.log('Done!');
      });
    }
  }
};
