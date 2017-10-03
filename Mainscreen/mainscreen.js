//create websocket
var ws = new WebSocket('ws://' + 'localhost' + ':8080');
var id = 'mainscreen';

// Stupid mainscreen
// All we do is identify outself on connection
// and run the function the server passes to us if it exists

// When the server sends us something
ws.onmessage = function(event) {
  var data = JSON.parse(event.data);

  // Server asks us to identify on first connection, send it a blank message
  if(data.identify) {
    send({});
  }

  if(data.callback) {
    //Create a function from the string of the function the server gave us
    //with the arguments passed in data.args
    //then execute it with the value of the args
    var f = Function(Object.keys(data.args), data.callback);
    f(Object.values(data.args));
  }

};

// append our id to all the data we send
var send = function(data) {
  data.id = this.id;
  ws.send(JSON.stringify(data));
}
