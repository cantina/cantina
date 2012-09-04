var http = require('http');

module.exports = {
  "name": "http",
  "version": require('../../package.json').version,

  "defaults": {
    "listen": true,
    "port": 8080
  },

  init: function (app, done) {
    var conf = app.conf.get('http');
    var server = http.createServer();
    app.http = server;
    done();
  },

  ready: function (app, done) {
    var conf = app.conf.get('http')

    function cb () {
      var addr = app.http.address();
      if (!conf.silent) {
        console.log('Opened an http server on http://' + addr.address + ':' + addr.port);
      }
      done();
    }

    if (conf.listen && !app.amino && conf.port) {
      if (conf.host) {
        app.http.listen(conf.port, conf.host, cb);
      }
      else {
        app.http.listen(conf.port, cb);
      }
    }
    else {
      done();
    }
  }
};
