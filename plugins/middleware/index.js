var app = require('../../'),
    middler = require('middler');

app.middler = middler;
app.middleware = app.middler(app.http);