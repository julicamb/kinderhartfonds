// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 8000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});


// Routing
app.use(express.static(__dirname + ''));
//var server = http.createServer(app);

// Listen on port 8000
// Uses process.env.PORT for Heroku deployment as Heroku will dynamically assign a port

/*var publicPath = path.resolve(__dirname, '');
app.use(static(publicPath));*/


app.get('/', function(req, res){
    res.sendFile('index.html', {root: publicPath});
});

// Socket IO
/*io.on('connection', function (socket) {
    // Create a room to broadcast to
    socket.join('main');
    socket.on('statechange', function (data) {
        // Broadcast changes to all clients in room
        socket.to('main').emit('urlchange', { url : data.url });
    });
});*/

io.on('connection', function (socket) {

    console.log('user connected');

    socket.on('VideoLogin', function () {
        socket.broadcast.emit('VideoLogin');
    });
    socket.on('ControlLogin', function () {
        socket.broadcast.emit('ControlLogin');
    });
    /*socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });*/
    socket.on('running', function (theme, phase, led, speed) {
        console.log('theme: ' + theme);
        console.log('phase: ' + phase);
        console.log('led: ' + led);
        console.log('speed: ' + speed);
        socket.broadcast.emit('running', theme, phase, led, speed);
    });
    socket.on('theme picked', function (data) {
        console.log('theme: ' + data);
        socket.broadcast.emit('theme picked', data);
    });
    socket.on('phase update', function (data) {
        console.log('Phase ' + data);
        socket.broadcast.emit('phase update', data);
    });
    socket.on('stop', function () {
        console.log('stop');
        socket.broadcast.emit('stop');
    });
    socket.on('speed update', function (data) {
        console.log('speed :' + data);
        socket.broadcast.emit('speed update', data);
    });
});
// Put a friendly message on the terminal
console.log("Server running on port: " + port);