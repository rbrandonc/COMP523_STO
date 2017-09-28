//Web socket/express stuff
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

//Game state
var spread = 100;
outbreakTypes = ['vaccineResistant', 'forgotTheOtherOne'];
var outbreakType = null; //0 or 1



//Just a log to see if we have a screen connected or nah
var log = setInterval(() => {console.log(connections.touchscreen && true, connections.projector && true)}, 2000);

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

  ws.onmessage = function(event) {
    console.log(event);
    //Always parse the event data as json
    event.data = JSON.parse(event.data);

    //If we are missing a connection check and see if this message is from missing client
    if(!connections.touchscreen ||
        !connections.mainscreen ||
        !connections.projector) {
      connections.touchscreen = !connections.touchscreen && event.data.id === "touchscreen" ? ws : connections.touchscreen;
      connections.mainscreen = !connections.mainscreen && event.data.id === "mainscreen" ? ws : connections.mainscreen;
      connections.projector = !connections.projector && event.data.id === "projector" ? ws : connections.projector;

      //If we are still missing a connection, dont do anything
      // if(!this.touchscreen || !this.mainscreen || !this.projector) { return; }
    }

    if(event.data.buttonID === 'increase') {
      spread += 100;
      var data = {spread: spread}
      connections.projector.send(JSON.stringify(data));
    }

    if(event.data.buttonID === 'decrease') {
      spread = spread > 0 ? spread - 100 : spread;
      var data = {spread: spread}
      connections.projector.send(JSON.stringify(data));
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
