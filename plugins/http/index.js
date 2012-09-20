var app = require('../../'),
    http = require('http');

app.conf.add({
  http: {
    'listen': true,
    'port': 8080
  }
});

app.on('init', function() {
  app.http = http.createServer();
});

app.on('ready', function() {
  var conf = app.conf.get('http');

  function cb () {
    var addr = app.http.address();
    if (!conf.silent) {
      console.log('Opened an http server on http://' + addr.address + ':' + addr.port);
    }
    app.emit('listening');
  }

  if (conf.listen && !app.amino && conf.port) {
    if (conf.host) {
      app.http.listen(conf.port, conf.host, cb);
    }
    else {
      app.http.listen(conf.port, cb);
    }
  }
});
