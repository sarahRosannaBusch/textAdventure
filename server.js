/**
 * @file    server.js
 * @brief   D&D Backstories server (runs on rpi)
 * @author  Sarah Rosanna Busch
 * @date    15 Oct 2021
 */

 var http = require('http').createServer(handler); //require http server, and create server with function handler()
 var fs = require('fs'); //require filesystem module
 const url = require('url');
 
 http.listen(8080); 
 
 function handler(req, res) { 
     var query = url.parse(req.url, true);  
     var file = query.pathname;
     if(file === "/") {
         file = "/index.html";
         console.log('req from ' + req.socket.remoteAddress);
     }
     var filename =  __dirname + file;
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
 
 http.once('listening', function() {
     console.log('server listening on port 8080');
 });