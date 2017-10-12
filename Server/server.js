/**
 * @overview This file is the main process.
 * It controls connecting and disconnecting of the screens,
 * passes them functions to run, and does game logic.
 */

// Websocket/express setup
var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
var connections = {
    touchscreen: null,
    mainscreen: null,
    projector: null
}

var wss = new WebSocketServer({server: server});
app.use(express.static(path.join(__dirname, '/public')));

//Server start listening
server.on('request', app);
server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});

//Just a log to see if we have a screen connected or nah
//var log = setInterval(() => {console.log(connections)}, 2000);

//This is for detecting if we lose connection to a screen
//Doesn't work but doesn't need to be implemented yet
// function heartbeat() {
//   this.isAlive = true;
// }
// const interval = setInterval(function ping() {
//   wss.clients.forEach(function each(ws) {
//     if (ws.isAlive === false) {
//       this.resetGame();
//       return ws.terminate();
//     }
//
//     ws.isAlive = false;
//     ws.ping('', false, true);
//   });
// }, 1000);

//When we establish a connection
wss.on('connection', function (ws) {
    // Also for screen loss detection
    // ws.isAlive = true;
    // ws.on('pong', heartbeat);

    //Ask connection to identify itself
    var data = {identify: true}
    ws.send(JSON.stringify(data));

    /** When the server receives a message from a screen, if it has an ID
     * update our reference to that websocket. If it is a message telling the server
     * the screen is no longer busy, set that screens busy variable to false.
     * If we don't have a connection to any of the three screens, return. If we have
     * All 3 screens or we just had a screen reconnect, initialize the game state
     * and continue the game. */
    ws.onmessage = function(event) {
        console.log(event.data);
        //Always parse the event data as json
        event.data = JSON.parse(event.data);
        console.log(event.data.buttonID);

        //Actual Game Code goes here
        if(event.data.buttonID === 'start'){
            console.log('Start the game');
            wss.clients.forEach(function(client){
                //do something
                client.send('Start the game');
            });
        }

        if(event.data.msg === 'playVideo'){
            console.log('Play the videos');
            wss.clients.forEach(function(client){
                //do something
                client.send('Play the video');
            });
        }

        if(event.data.msg === 'nextRound'){
            console.log('Start the next round');
            wss.clients.forEach(function(client){
                //do something
                client.send('Start the next round');
            });
        }

        console.log(wss.clients.size);
        //Add connection to our list of conncetions
        // TODO: need to reset state if we reconnect a screen
        //If we are missing a connection check and see if this message is from missing client
        if(!connections.touchscreen ||
            !connections.mainscreen ||
            !connections.projector) {
            connections.touchscreen = !this.touchscreen && event.data.id === "touchscreen" ? ws : null;
            connections.mainscreen = !this.mainscreen && event.data.id === "mainscreen" ? ws : null;
            connections.projector = !this.projector && event.data.id === "projector" ? ws : null;

            //If we are still missing a connection, dont do anything
            if(!this.touchscreen || !this.mainscreen || !this.projector) { return; }
        }
    };

    ws.on('close', function () {
        console.log('closing');
        //do this when connection is closed
        // clearInterval(interval);
        // clearInterval(log);
    });
});

//Reset Game
resetGame = function() {
    console.log('Game Reset');
}
