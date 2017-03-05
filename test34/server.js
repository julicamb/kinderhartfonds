var app = require('express')();
var path = require('path');
var static  = require('express-static');
var publicPath = path.resolve(__dirname, '');
app.use(static(publicPath));
app.get('/', function(req, res){
    res.sendFile('server.html', {root: publicPath});
});
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ });
server.listen(3000);