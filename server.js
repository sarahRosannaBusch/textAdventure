/**
 * @file    server.js
 * @brief   D&D Backstories server (runs on rpi)
 * @author  Sarah Rosanna Busch
 * @version 0.1
 * @date    16 May 2022
 */

const http = require('http'); 
const url = require('url');
const fs = require('fs'); 

const PORT = 8080;

const USERS = require('./user/users.json');

const server = new http.createServer(function (req, res) {
    var query = url.parse(req.url, true);  
    var file = query.pathname;
    var clientIP = req.socket.remoteAddress;
    if(file === "/") {
        file = "/index.html";
        console.log('req from ' + clientIP);
    }
    var filename =  __dirname + file;

    if(req.method === 'POST') {
        req.setEncoding('utf8');
        req.on('data', function(data) {
            console.log(Date.now() + ' ' + clientIP + ': ' + data);
            data = JSON.parse(data);
            for(key in data) {
                switch(key) {
                    case 'login':
                        let username = data.login.username;
                        let password = data.login.password;
                        if(USERS[username]) {
                            if(USERS[username] === password) {
                                console.log(username + ' has logged in.');
                                res.write(JSON.stringify({login:true}));
                            } else {
                                console.log(username + ' has wrong password');
                                res.write(JSON.stringify({login:false}));
                            }
                        } else {
                            console.log('invalid login attempt');
                            res.write(JSON.stringify({login:false}));
                        }
                        break;
                    default:
                        res.write(JSON.stringify({ack:true}));
                        break;
                }
            }
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