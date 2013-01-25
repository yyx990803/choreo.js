// Serve a static folder over http using Node's default modules
// and open it with default browser on MacOS X

var http    = require('http'),
    fs      = require('fs'),
    path    = require('path'),
    spawn   = require('child_process').spawn;

var mimeTypes = {
    '.js'   : 'application/javascript',
    '.css'  : 'text/css',
    '.jpg'  : 'image/jpeg',
    '.png'  : 'image/png'
};
 
http.createServer(function (request, response) {
     
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath),
        contentType = mimeTypes[extname];

    fs.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    console.log('[Error]:500 ' + filePath);
                    response.writeHead(500);
                    response.end();
                } else {
                    console.log('[OK]:200 ' + filePath);
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        } else {
            console.log('[Not Found]:404 ' + filePath);
            response.writeHead(404);
            response.end();
        }
    });
     
}).listen(8080);

spawn('open', ['http://0.0.0.0:8080']);