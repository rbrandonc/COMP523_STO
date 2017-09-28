var ws = new WebSocket('ws://' + 'localhost' + ':8080');
var id = 'touchscreen';

//Do this when we finish loading the DOM
document.addEventListener("DOMContentLoaded", function(event) {

  //Add a handler to one of the buttons
  document.getElementById('increase').onclick=function() {
    //send a simple click event over websocket when div is clicked
    var click = {eventType: 'buttonClick', buttonID: 'increase'};
    this.send(click);
  }.bind(this);

  document.getElementById('decrease').onclick=function() {
    //send a simple click event over websocket when div is clicked
    var click = {eventType: 'buttonClick', buttonID: 'decrease'};
    this.send(click);
  }.bind(this);
}.bind(this));

//When the server sends us something
ws.onmessage = function(event) {
  //Server asks us to identify on first connection, send it a blank message
  if(JSON.parse(event.data).identify) {
    send({});
  }
};

//append our id to all the data we send
var send = function(data) {
  data.id = this.id;
  ws.send(JSON.stringify(data));
}
