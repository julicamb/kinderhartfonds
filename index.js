// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 8000;
//exec om commando's te kunnen uitvoeren via sh files
var exec = require('child_process').exec, child;

var _theme;

//send arguments as: red, green, blue
//color values are 0-255.

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



//send arguments as: red, green, blue
//color values are 0-255.

    var execString = 'sh commands/mainServer.sh';
    exec(execString);

    console.log('user connected');

    exec('sh commands/rpm.sh');
    socket.on('VideoLogin', function () {
        socket.broadcast.emit('VideoLogin');
    });
    socket.on('ControlLogin', function () {
        socket.broadcast.emit('ControlLogin');
    });
    socket.on('stopSystem', function () {
        socket.broadcast.emit('stopSystem');
        var execString = 'sh commands/shutdown.sh';
        exec(execString);
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
        //geen nut hier maar gewoon als test
        //exec zal de 1.sh file executeren waar er een commando uitgevoerd wordt
        //exec('sh 1.sh /directory');
        _theme = data;
        var execString = 'sh commands/' + data + '/1.sh';
        exec(execString);
        var ledString = 'sh commands/' + data + '/led.sh';
        exec(ledString);
        console.log('theme: ' + data);
        socket.broadcast.emit('theme picked', data);
    });
    socket.on('phase update', function (data) {

        /*if(_phase != 1 && _phase != 2 && _phase != 8) {
            // tussenscherm-video
            var src = '../assets/videos/' + _theme + '/' + (_phase-1) + '_naar_' + _phase + '.mp4';
            console.log(src);
            play(src, false);
        } else {
            // fase-video
            var src = '../assets/videos/' + _theme + '/' + _phase + '.mp4';
            console.log(src);
            play(src, true);
        }*/

        var execString;

        if(data != 1 && data != 7){
            // tussenscherm-video
            //'sh macCommands/' voor te testen op mac
            execString = 'sh commands/' + _theme + '/' + (data - 1) + '-' + data + '.sh';
            console.log(execString);
        } else {
            // fase-video
            //'sh macCommands/' voor te testen op mac
            execString = 'sh commands/' + _theme + '/' + data + '.sh';
            console.log(execString);
        }

        exec(execString);
        console.log('Phase ' + data);
        socket.broadcast.emit('phase update', data);
    });
    socket.on('stop', function () {
        console.log('stop');
        exec('sh commands/stop.sh');
        socket.broadcast.emit('stop');
    });
    socket.on('speed update', function (data) {
        console.log('speed :' + data);
        socket.broadcast.emit('speed update', data);
    });
});
// Put a friendly message on the terminal
console.log("Server running on port: " + port);