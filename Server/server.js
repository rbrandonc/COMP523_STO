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
var wss = new WebSocketServer({server: server});
app.use(express.static(path.join(__dirname, '/public')));

// References to our screen functions
var projector = require('./projector');
var mainscreen = require('./mainscreen');
var touchscreen = require('./touchscreen');

// Server start listening
server.on('request', app);
server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});

// Screen connection debugging
var log = setInterval(() => {
  console.log('touchscreen: ' + (touchscreen.ws ? 'connected ' + (touchscreen.busy ? '(busy)' : '(idle)'): ''),
              ' projector: ' + (projector.ws ? 'connected '  + (projector.busy ? '(busy)' : '(idle)') : ''),
              ' mainscreen: ' + (mainscreen.ws ? 'connected ' + (mainscreen.busy ? '(busy)' : '(idle)'): ''))
}, 2000);

// This is for detecting if we lose connection to a screen
// Doesn't work but doesn't need to be implemented yet
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

/** When a connection to a screen is made, ask it to identify itself. */
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
    //Always parse the event data as json
    event.data = JSON.parse(event.data);

    //Add connection to our list of conncetions
    // TODO: need to reset state if we reconnect a screen
    touchscreen.ws = event.data.id === "touchscreen" ? ws : touchscreen.ws;
    mainscreen.ws = event.data.id === "mainscreen" ? ws : mainscreen.ws;
    projector.ws = event.data.id === "projector" ? ws : projector.ws;

    //If the frontend is just telling us it finished
    //Set its busy variable to false
    if(event.data.done) { eval(event.data.id + '.busy' + ' = ' + false); return; }

    //If we are still missing a connection, dont do anything
    if(!touchscreen.ws || !mainscreen.ws || !projector.ws) { return; }

    //Actual game code goes here

  };

  ws.on('close', function () {
    console.log('closing');
    //do this when connection is closed
    // clearInterval(interval);
    // clearInterval(log);
  });
});

/**
 * Game State
 * @constant {Object}
 * @default
 */
var state = {
  initialize: () => {
    this.spread = 100;
    this.outbreakTypes = ['vaccineResistant', 'forgotTheOtherOne'];
    this.outbreakType = null; //0 or 1
  }
}
state.initialize();
