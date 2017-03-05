var app     = require('express')();
var path = require('path');
var http = require('http');
var server  = http.Server(app);
var io      = require('socket.io')(server);
var static  = require('express-static');



//var server = http.createServer(app);

// Listen on port 8000
// Uses process.env.PORT for Heroku deployment as Heroku will dynamically assign a port
server.listen(process.env.PORT || 8000);

var publicPath = path.resolve(__dirname, '');


app.use(static(publicPath));
app.get('/', function(req, res){
    res.sendFile('index.html', {root: publicPath});
});

// Socket IO
io.on('connection', function (socket) {
    // Create a room to broadcast to
    socket.join('main');
    socket.on('statechange', function (data) {
        // Broadcast changes to all clients in room
        socket.to('main').emit('urlchange', { url : data.url });
    });
});
// Put a friendly message on the terminal
console.log("Server running at http://localhost:8000/");