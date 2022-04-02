/**
 * @file    server.js
 * @brief   D&D Backstories server (runs on rpi)
 * @author  Sarah Rosanna Busch
 * @date    31 March 2022
 */

const http = require('http'); 
const url = require('url');
const fs = require('fs'); 

const PORT = 8080;

const server = new http.createServer(function (req, res) {
    var query = url.parse(req.url, true);  
    var file = query.pathname;
    if(file === "/") {
        file = "/index.html";
        console.log('req from ' + req.socket.remoteAddress);
    }
    var filename =  __dirname + file;

    if(req.method === 'POST') {
        req.setEncoding('utf8');
        req.on('data', function(data) {
            console.log(data);
            res.write(JSON.stringify({ack:true}));
            res.end();
        });
    } else if(req.method === 'GET') {
        fs.readFile(filename, function(err, data) { 
            if(err) {
                res.writeHead(404, {'Content-Type': 'text'});
                return res.end("404 File Not Found: " + filename);
            }
            var mimeType = filename.match(/(?:html|js|css|svg)$/i);
            if(mimeType && mimeType[0] === 'svg') {
                mimeType = 'image/svg+xml';
            } else {
                mimeType =  mimeType ? 'text/' + mimeType : 'text/plain';
            }
            
            //console.log('serving: ' + filename);
            res.writeHead(200, {'Content-Type': mimeType });
            res.write(data);
            res.end();
        });
    }
});

server.listen(PORT);

server.once('listening', function() {
    console.log('server listening on port ' + PORT);
});

server.on('error', function(e) {
    console.log('error code: ' + e.code);
});