var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
var t = 0;
var connections = {
  touchscreen: null,
  mainscreen: null,
  projector: null
}

app.use(express.static(path.join(__dirname, '/public')));

var wss = new WebSocketServer({server: server});
wss.on('connection', function (ws) {
  //When we establish a connection

  //Set our local connections = ws based on some unique field in ws
  //Can't figure out how to make a unique field to identify each screen
  //this.connections.touchscreen = ws;

  //Start a timer to count connection timer
  //doesn't work cant remember how this binding works
  var id = setInterval(() => {
    ws.send(JSON.stringify('{time: ' + this.t + '}'), function () {});
    this.t++;
  }.bind(this), 1000);

  ws.onmessage = function(event) {
    //Whenever this socket sends us a message
    //This should only happen from touchscreen?
    console.log(event.data);
  };

  ws.on('close', function () {
    //do this when connection is closed
    clearInterval(id);
  });
});

//Server start listening
server.on('request', app);
server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});
