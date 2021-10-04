'use strict';

/**
 * @file    server.js
 * @brief   nodeJS http web server template
 * @author  Sarah Rosanna Busch
 * @date    31 July 2020
 */

const http = require('http');
const url = require('url');
const fs = require('fs');

const server = new http.createServer(function (req, res) {
    var query = url.parse(req.url, true);  
    var filename = __dirname + query.pathname;

    if(req.method === 'POST') {
        req.setEncoding('utf8');
        req.on('data', function(data) {
            console.log(data);
            res.write(JSON.stringify({ack:true}));
            res.end();
        });
    } else {
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
            
            console.log('serving: ' + filename);
            res.writeHead(200, {'Content-Type': mimeType });
            res.write(data);
            res.end();
        });
    }
    
});

server.listen(80);

server.once('listening', function() {
    console.log('server listening on port 9999');
});
