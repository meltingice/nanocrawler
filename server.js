var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();

app.use('/', proxy({ target: 'http://10.0.1.152:7076', changeOrigin: true }));
app.listen(3001);
