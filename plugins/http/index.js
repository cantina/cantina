var http = require('http');

module.exports = {
  "name": "http",
  "version": require('../../package.json').version,

  "defaults": {
    "listen": true,
    "port": 8080
  },

  init: function(app, done) {
    var conf = app.conf.get('http');
    var server = http.createServer();

    function cb() {
      var addr = server.address();
      if (!conf.silent) {
        console.log('Opened an http server on http://' + addr.address + ':' + addr.port);
      }
      app.http = server;
      done();
    }

    if (conf.listen && conf.port) {
      if (conf.host) {
        server.listen(conf.port, conf.host, cb);
      }
      else {
        server.listen(conf.port, cb);
      }
    }
    else {
      done();
    }
  }
};
