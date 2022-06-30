/**
 * @file    server.js
 * @brief   D&D Backstories server (runs on rpi)
 * @author  Sarah Rosanna Busch
 * @version 0.1
 * @date    8 June 2022
 */

const http = require('http'); 
const url = require('url');
const fs = require('fs'); 

const PORT = 8080;
const USERS = require('./user/users.json');
const SAVEDATA = false; //set to true on server

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
            try {
                data = JSON.parse(data);
            } catch(e) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('What ya trying to do here, bud?');
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            for(key in data) {
                switch(key) {
                    case 'login':
                        let username = data.login.username;
                        let password = data.login.password;
                        if(USERS[username]) {
                            if(USERS[username] === password) {
                                console.log(username + ' has logged in.');
                                let responseData = {
                                    'login': true,
                                    'username': username
                                };
                                let userData = null;
                                let userFile = './user/users/' + username + '.json';
                                try {
                                    userData = fs.readFileSync(userFile);
                                } catch(e) {
                                    userData = fs.readFileSync('user/users/_template.json');
                                    if(SAVEDATA) {
                                        fs.writeFile(userFile, userData, function(err) {
                                            if(err) console.log('failed to create file for ' + username);
                                            else console.log('created new game file for ' + username);
                                        });
                                    }
                                }
                                try {                                    
                                    userData = JSON.parse(userData);
                                } catch(e) {
                                    console.log('cannot parse userData');
                                    return;
                                }
                                let player = {};
                                for(key in userData['player']) {
                                    player[key] = userData['player'][key];
                                }
                                let curChar = player.charName;
                                for(key in userData[curChar]) {
                                    player[key] = userData[curChar][key];
                                }
                                responseData['userData'] = player;
                                res.write(JSON.stringify(responseData));
                            } else {
                                console.log(username + ' has wrong password');
                                res.write(JSON.stringify({login:false}));
                            }
                        } else {
                            console.log('invalid login attempt');
                            res.write(JSON.stringify({login:false}));
                        }
                    break;
                    case 'playerChoices':
                        if(data.username) {
                            let filename = './user/users/' + data.username + '.json';
                            try {
                                let savedData = fs.readFileSync(filename);
                                try {
                                    savedData = JSON.parse(savedData);
                                } catch(e) {
                                    console.log('playerChoices not saved: ' + JSON.stringify(e));
                                    return;
                                }
                                savedData.player.choices = data.playerChoices;
                                savedData = JSON.stringify(savedData, null, 2);
                                if(SAVEDATA) {
                                    fs.writeFile(filename, savedData, function(e) {
                                        if(e) {
                                            console.log('error writing to ' + filename);
                                        }
                                        console.log('game data saved to ' + filename);
                                    });
                                }  
                            } catch(e) {
                                console.log('could not find game file for' + data.username);
                            }
                        }
                    break;
                    case 'diceRolls':
                        if(data.username) {
                            let filename = './user/users/' + data.username + '.json';
                            try {
                                let savedData = fs.readFileSync(filename);
                                try {
                                    savedData = JSON.parse(savedData);
                                } catch(e) {
                                    console.log('diceRolls not saved: ' + JSON.stringify(e));
                                    return;
                                }
                                savedData.player.diceRolls = data.diceRolls;
                                savedData = JSON.stringify(savedData, null, 2);
                                if(SAVEDATA) {
                                    fs.writeFile(filename, savedData, function(e) {
                                        if(e) {
                                            console.log('error writing to ' + filename);
                                        }
                                        console.log('game data saved to ' + filename);
                                    });
                                }
                            } catch(e) {
                                console.log('could not find game file for' + data.username);
                            }
                        }
                    break;
                    case 'playerData':
                        if(data.username) {                            
                            let filename = './user/users/' + data.username + '.json';
                            try {
                                let savedData = fs.readFileSync(filename);
                                try {
                                    savedData = JSON.parse(savedData);
                                } catch(e) {
                                    console.log('playerData not saved: ' + JSON.stringify(e));
                                    return;
                                }
                                let char = savedData.player.charName;
                                for(item in data.playerData) {
                                    switch(item) {
                                        case 'dndNoob': case 'charName': case 'encounter':
                                            savedData.player[item] = data.playerData[item];
                                        break;
                                        default:
                                            if(char) {
                                                savedData[char][item] = data.playerData[item];
                                            } else {
                                                console.log('unknown character: ' + char);
                                            }
                                        break;
                                    }
                                }
                                savedData = JSON.stringify(savedData, null, 2);
                                if(SAVEDATA) {
                                    fs.writeFile(filename, savedData, function(e) {
                                        if(e) {
                                            console.log('error writing to ' + filename);
                                        }
                                        console.log('game data saved to ' + filename);
                                    });
                                }
                            } catch(e) {
                                console.log('could not find game file for' + data.username);
                            }
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