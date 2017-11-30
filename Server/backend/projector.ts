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

//Keep track of the spread data on the server end
var spreadData: number[][] = [];
var spread = 0;

exports.getSpreadSize = () => {
  return spreadData.length;
}

//give a positive amount to increase spread by that amount, negative to decrease
exports.spread = function(amount: any) {
  var difference = amount - spread;
  var updateMap = setInterval(() => {

    //if the difference between spread on the map and what we want is +, increase intensity, otherwise decrase
    console.log(difference)
    if(difference > 0) {
      //pick a random point
      var idx = Math.floor(Math.random()*spreadData.length);
      if(spreadData[idx][2] < 1) {
        //if intensity is < 1 increase it
        spreadData[idx][2] += .02;
        spreadData.splice(spreadData.length-1, 0, spreadData.splice(idx, 1)[0]);
      }

      if(spreadData[idx][2] > .2){
        //otherwise create a new point nearby
        var x = Math.floor(spreadData[idx][0] + (100*(Math.random()-.5)))
        var y = Math.floor(spreadData[idx][1] + (100*(Math.random()-.5)))
        var p = [x, y, 0.0];
        spreadData.push(p);
      }
    } else if(difference < 0){
      //shrink spread
      if(spreadData[spreadData.length-1][2] > 0) {
        spreadData[spreadData.length-1][2] -= .02;
        spreadData.splice(0, 0, spreadData.splice(spreadData.length-1, 1)[0]);
      }
      if(spreadData[spreadData.length-1][2] < .2){
        spreadData.pop();
      }
    }

    //This is what the front end will execute
    var funct = function (spreadData: any) {
      // console.log(spreadData);
      //get the canvas
      var canvas = document.getElementById('canvas');
      var heat = simpleheat(canvas);
      // console.log(heat)

      //Draw the data
      heat.data(spreadData);
      heat.draw(.01);

      send({done: true});
    }

    var data = {callback: funct.toString(), args: {spreadData: spreadData}};
    send(data);

    console.log('checking difference')
    if(difference > 0) {
      difference--;
    } else if(difference < 0) {
      difference++;
    } else {
      console.log("CLEARING MAP UPDATE")
      clearInterval(updateMap);
    }
  }, 10)

}

exports.initialize = function() {

  for(var x = 0; x < 10; x++) {
    var item = [Math.floor(800*Math.random()), Math.floor(400*Math.random()), 0.0];
    spreadData.push(item);
  }

  // console.log(spreadData);
  var funct = function (spreadData: any) {
    var canvas = document.getElementById('canvas');
    var heat = simpleheat(canvas);

    heat.data(spreadData);
    heat.gradient({0.0: 'rgb(150, 255, 0)', 1: 'rgb(255, 0, 0)'});
    heat.resize();
    heat.radius(15, 25);
    heat.draw(.01);

    send({done: true});
  }

  var data = {callback: funct.toString(), args: {spreadData: spreadData}};
  send(data);

  //initial spread amount
  this.spread(1000);
}
