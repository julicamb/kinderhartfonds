var http = require('http');
var fs = require('fs');

fs.readFile('index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    var server = http.createServer(function (request, response) {
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(html);
  response.end();
});
// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
});

