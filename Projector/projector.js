/**
 * Dumb front end, just runs functions passed to it by the server
 * @module FrontEndProjector
 */

 /** @type {WebSocket} Websocket reference */
var ws = new WebSocket('ws://' + 'localhost' + ':8080');
/** @type {String} Screen ID */
var id = 'projector';

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
    var f = Function(Object.keys(data.args), data.callback);
    f(Object.values(data.args));
  }
};

// append our id to all the data we send
var send = function(data) {
  data.id = this.id;
  ws.send(JSON.stringify(data));
}

document.addEventListener('DOMContentLoaded', function(event) {
    // spread(500)
    // setTimeout(() => {spread(900)}, 8000);
    // setTimeout(() => {spread(200)}, 16000);
    var canvas = document.getElementById('canvas');
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var canvas = document.getElementById('canvas');
    canvas.height = h;
    canvas.width = w;

    var heat = simpleheat(canvas);
    var data = [];

    for(var j = 1; j < 10; j+=1) {
      var item = [w*Math.random(),Math.random()*h,0.5];
      data.push(item)
    }

    console.log(data);
    heat.data(data);
    heat.gradient({0.0: 'blue', 0.5: 'lime', 1: 'red'});
    heat.resize();
    heat.radius(10, 20);
    heat.draw();

    var grow = setInterval(() => {
      var count = 0;

      for(let point of data) {
        point[2] += .01;
      }

      var n = [];
      for(let point of data) {
        for(var x = 0; x < 10; x++) {
          var probability = Math.random();
          if(probability > 0.5) {
            n.push([
              point[0] + (((Math.random()*2)-1)*10),
              point[1] + (((Math.random()*2)-1)*10),
              .5]);
            }
        }
      }

      for(let p of n) {
        data.push(p);
      }

      count++;
      if(count > 20) {
        clearInterval(this);
      }

      heat.draw();

    }, 300)
});
