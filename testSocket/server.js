/**
 * Created by julien on 28/03/2017.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 8000;
//exec om commando's te kunnen uitvoeren via sh files
var exec = require('child_process').exec, child;
var _theme;
//RPM
var SerialPort = require('serialport');
var connections = [];
var VirtualSerialPort = require('virtual-serialport');
var Arduino = new VirtualSerialPort(
    "/dev/ttyUSB0", {
        baudRate: 9600,
        parser: SerialPort.parsers.readline("\n")
    });
//endRPM

//Test
function counter() {
    var i = 45;
    var funcNameHere = function(){
        if (i == 100) {
            clearInterval(this)
        } else {
            function randomIntFromInterval(min,max)
            {
                return Math.floor(Math.random()*(max-min+1)+min);
            }
            var randomNumber = randomIntFromInterval(45,75);
            console.log(randomNumber);
            Arduino.writeToComputer(randomNumber);
        }
    };
    // This block will be executed 100 times.
    setInterval(funcNameHere, 1000);
    funcNameHere();
}
// EndTest

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
app.use(express.static(__dirname + ''));
app.get('/', function(req, res){
    res.sendFile('index.html', {root: publicPath});
});
Arduino.on('open', function(){
    console.log("Arduino port open. Data rate : " + Arduino.baudRate);
    counter();
});
Arduino.on('close', function(){
    console.log("Arduino disconnected");
});
Arduino.on('error', function(error){
    console.log("Arduino error: " + error);
});
io.on('connection', function (socket) {
    console.log('user connected (io.on(connection))');
    socket.on('RPM', function(){
        console.log("Gauge handler connected");
    });
    Arduino.on('data', function(data){
        socket.broadcast.emit('newData', data);
    });
});
console.log("Server running on port: " + port);

// This function broadcasts messages to all webSocket clients
function broadcast(data) {
    for (c in connections) {     // iterate over the array of connections
        connections[c].send(JSON.stringify(data)); // send the data to each connection
    }

function showData(result) {
    function rotateDial()
    {
        // when the server returns, show the result in the div:
        var str = result.data;
        //only get the rpm number
        var rpm = parseInt(str.replace(/\D/g,''));
        //make sure it's a number
        console.log(typeof rpm + rpm);