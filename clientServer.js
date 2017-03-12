/**
 * Created by julien on 12/03/2017.
 */
var socket = require('socket.io-client')('http://192.168.0.37:8000');
var exec = require('child_process').exec, child;

socket.on('connect', function () {
    // socket connected
    console.log('server connected');
    var execString = 'sh commands/clientServer.sh';
    exec(execString);
});
socket.on('theme picked', function (data) {
    console.log('theme picked: ' + data);
    var execString = 'sh commands/' + data + '/background.sh';
    exec(execString);
    console.log('background video should have started');
});
socket.on('stop', function () {
    exec('sh commands/stop.sh');
    console.log('video should have stopped');
});
console.log('connect should have happened');