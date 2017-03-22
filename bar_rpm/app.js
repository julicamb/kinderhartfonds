/**
 * Created by julien on 22/03/2017.
 */
var socket = io();

$('#themaNaam').text().replace('banana');

socket.on('theme picked', function(data) {
    $('#themaNaam').text(data);
});