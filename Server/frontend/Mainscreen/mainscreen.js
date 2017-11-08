/**
 * Dumb front end, just runs functions passed to it by the server
 * @module FrontEndMainscreen
 */

 /** @type {WebSocket} Websocket reference */
var ws = new WebSocket('ws://' + 'localhost' + ':8080');
/** @type {String} Screen ID */
var id = 'mainscreen';

/** Either identify ourself or run the function send by the server if it exists */
ws.onmessage = function(event) {
  var data = JSON.parse(event.data);

  /** Server asks us to identify on first connection, send it a blank message */
  if(data.identify) {
    send({});
  }

  if(data.callback) {
    //Create a function from the string of the function the server gave us
    //with the arguments passed in data.args
    //then execute it with the value of the args
    var f = Function(...Object.keys(data.args), data.callback);
    f(...Object.values(data.args));
  }

};

// append our id to all the data we send
var send = function(data) {
  data.id = this.id;
  ws.send(JSON.stringify(data));
}
