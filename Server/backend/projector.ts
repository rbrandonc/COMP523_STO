/**
 * All functions to be passed to the projector
 * @module Projector
 */

/** @type {WebSocket} A reference to the websocket, set by server */
exports.ws = null;

/** @type {Boolean} Whether or not we are still running a function passed by the server */
exports.busy = false;
var simpleheat = require('./simpleheat.js');

/** All functions should look like this
Call this function from server.js by doing projector.functionName(args)
it will then be sent to the front end to be executed.

 exports.functionName = function(arg1, arg2) {

   funct = function (arg1, arg2) {
      This is where all your stuff goes

      //EVERY FUNCTION MUST END WITH THIS LINE
      //this tells the server that we finished the function
      send({done: true});
   }

 //Just change this to match whatever arguments your function takes in
   var data = {callback: funct.toString(), args: {arg1: arg1, arg2, arg2}};
   send(data);
 } */


/** Send function to the projector
We will only ever send a function and its arguments */
var send = (data: any) => {
  var stuffToSend = {callback: String, args: String};
  if(this.ws) {
    if(data.callback) {
      //We can only send strings so parse the function body as a string
      stuffToSend.callback = data.callback.slice(data.callback.indexOf("{") + 1, data.callback.lastIndexOf("}"));
      if(data.args) { stuffToSend.args = data.args }
    }
    this.ws.send(JSON.stringify(stuffToSend));
    this.busy = true;
  } else {
    console.log('projector not connected');
  }
}

var spreadData: any = [];

exports.spread = function(amount: any) {

  //While the num points we have added < amount given
  //add 10 more points and send them to the frontend
  var updateMap = setInterval((amount) => {
    var added = 0;
    for(let point of spreadData) {
      if(added < 10 && Math.random() > .5) {
        var p = [
          (100*(Math.random()-.5))+point[0],
          (100*(Math.random()-.5))+point[1],
          .05
        ];

        spreadData.push(p);
        added++;
      }
    }

    var funct = function (amount: any, spreadData: any) {
      var canvas = document.getElementById('canvas');
      var heat = simpleheat(canvas);

      heat.data(spreadData);
      heat.draw();

      //Only have projector says its done if this is the last map update
      if(amount < spreadData.length)
        send({done: true});
    }

    var data = {callback: funct.toString(), args: {amount: amount, spreadData: spreadData}};
    send(data);

    if(amount < spreadData.length)
      clearInterval(updateMap);
  }, 100)

}

exports.initialize = function() {
  for(var j = 1; j < 10; j+=1) {
    var item = [400*Math.random(),Math.random()*400,Math.random()];
    spreadData.push(item);
  }
  var funct = function (spreadData: any) {
    var canvas = document.getElementById('canvas');
    var heat = simpleheat(canvas);



    heat.data(spreadData);
    heat.gradient({0.0: 'rgb(150, 255, 0)', 0.5: 'rgb(255, 237, 0)', 1: 'rgb(255, 0, 0)'});
    heat.resize();
    heat.radius(10, 25);
    heat.draw();

    send({done: true});
  }

  var data = {callback: funct.toString(), args: {spreadData: spreadData}};
  send(data);
}
