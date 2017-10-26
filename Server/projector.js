/**
 * All functions to be passed to the projector
 * @module Projector
 */

/** @type {WebSocket} A reference to the websocket, set by server */
exports.ws = null;

/** @type {Boolean} Whether or not we are still running a function passed by the server */
exports.busy = false;

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
var send = (data) => {
  var stuffToSend = {};
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

var spreadData = [];

exports.spread = function(amount) {

  //Shrink
  if(amount < 0) {
    var shrink = setInterval(() => {
      for(var k = 0; k > amount; k--) {
        spreadData.pop();

        if(spreadData.length <= 20) {
          break;
        }
      }

      clearInterval(shrink);
    }, 1);

  } else {
    for(let point of spreadData) {
      if(point[2] < 1)
        point[2] += .001;
    }
    var n = [];
    var points = 0;
    for(let point of spreadData) {
      for(var x = 0; x < 1; x++) {
        var probability = Math.random();
        if(probability < 0.05) {
          n.push([
            point[0] + (((Math.random()*2)-1)*50),
            point[1] + (((Math.random()*2)-1)*50),
            .1]);
            points++;
        }
        if(points >= amount) {
          break;
        }
      }
      if(points >= amount) {
        break;
      }
    }

    for(let p of n) {
      spreadData.push(p);
    }

  }

  funct = function (amount, spreadData) {
    var canvas = document.getElementById('canvas');
    var heat = simpleheat(canvas);

    heat.data(spreadData);
    heat.draw();

    send({done: true});
  }

  var data = {callback: funct.toString(), args: {amount: amount, spreadData: spreadData}};
  send(data);
}

exports.initialize = function() {
  for(var j = 1; j < 10; j+=1) {
    var item = [400*Math.random(),Math.random()*400,Math.random()];
    spreadData.push(item);
  }
  funct = function (spreadData) {
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
