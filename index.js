// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 8000;
//exec om commando's te kunnen uitvoeren via sh files
var exec = require('child_process').exec, child;

var _theme;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname + ''));
app.get('/', function(req, res){
    res.sendFile('index.html', {root: publicPath});
});
io.on('connection', function (socket) {
    var execString = 'sh commands/mainServer.sh';
    exec(execString);
    console.log('user connected');
    exec ("bash commands/led.sh white");
    //exec('sh commands/rpm.sh');
    socket.on('VideoLogin', function () {
        socket.broadcast.emit('VideoLogin');
    });
    socket.on('ControlLogin', function () {
        socket.broadcast.emit('ControlLogin');
    });
    socket.on('stopSystem', function () {
        socket.broadcast.emit('stopSystem');
        var ledString = 'bash commands/led.sh off';
        exec(ledString);
        var execString = 'sh commands/shutdown.sh';
        exec(execString);
    });
    socket.on('running', function (theme, phase, led, speed) {
        socket.broadcast.emit('running', theme, phase, led, speed);
    });
    socket.on('theme picked', function (data) {
        _theme = data;
        var execString = 'bash commands/video.sh ' + data + ' ' + 1;
        exec(execString);
        var ledString = 'bash commands/led.sh ' + data;
        exec(ledString);
        socket.broadcast.emit('theme picked', data);
    });
    socket.on('phase update', function (data) {
        var execString;
        if(data != 1 && data != 7){
            // tussenscherm-video
            //'sh macCommands/' voor te testen op mac
            //bash commands/video.sh --- voor de commando uit om de video af te spelen met omxplayer
            //bash commands/video.sh $1 $2 $3
            // voorbeeld: bash commands/video.sh ruimte 3 4 -> video ruimte 3 naar 4
            execString = 'bash commands/video.sh ' + _theme + ' ' + (data - 1) + ' ' + data;
        } else {
            // fase-video
            //'sh macCommands/' voor te testen op mac
            //bash commands/video.sh $1 $2 $3
            // voorbeeld: bash commands/video.sh ruimte 3 -> video ruimte fase 3
            execString = 'bash commands/video.sh ' + _theme + ' ' + data;
        }
        exec(execString);
        socket.broadcast.emit('phase update', data);
    });
    socket.on('stop', function () {
        exec ("bash commands/led.sh white");
        exec('sh commands/stop.sh');
        socket.broadcast.emit('stop');
    });
    socket.on('speed update', function (data) {
        socket.broadcast.emit('speed update', data);
    });
});
// Put a friendly message on the terminal
console.log("Server running on port: " + port);

//RPM
/*
var SerialPort = require('serialport');       // include the serialport library
var WebSocketServer = require('ws').Server;   // include the webSocket library

// configure the webSocket server:
var SERVER_PORT = 8080;                 // port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
var connections = new Array;            // list of connections to the server

// configure the serial port:
var port1 = new SerialPort(
    "/dev/cu.usbmodem1411", {                   // serial communication options
        baudRate: 9600,                           // data rate: 9600 bits per second
        parser: SerialPort.parsers.readline("\n") // newline generates a data event
    });

// set up event listeners for the serial events:
port1.on('open', showPortOpen);
port1.on('data', sendSerialData);
port1.on('close', showPortClose);
port1.on('error', showError);


// ------------------------ Serial event functions:
// this is called when the serial port is opened:
function showPortOpen() {
    console.log('port1 open. Data rate: ' + port1.options.baudRate);
}

// this is called when new data comes into the serial port:
function sendSerialData(data) {
    // if there are webSocket connections, send the serial data
    // to all of them:
    console.log(Number(data));
    if (connections.length > 0) {
        broadcast(data);
    }
}

function showPortClose() {
    console.log('port1 closed.');
}

// this is called when the serial port has an error:
function showError(error) {
    console.log('Serial port1 error: ' + error);
}

function sendToSerial(data) {
    console.log("sending to serial: " + data);
    port.write(data);
}

// ------------------------ webSocket Server event functions
wss.on('connection', handleConnection);
function handleConnection(client) {
    console.log("New Connection");        // you have a new client
    connections.push(client);             // add this client to the connections array

    client.on('message', sendToSerial);      // when a client sends a message,

    client.on('close', function() {           // when a client closes its connection
        console.log("connection closed");       // print it out
        var position = connections.indexOf(client); // get the client's position in the array
        connections.splice(position, 1);        // and delete it from the array
    });
}
// This function broadcasts messages to all webSocket clients
function broadcast(data) {
    for (c in connections) {     // iterate over the array of connections
        connections[c].send(JSON.stringify(data)); // send the data to each connection
    }
}
*/