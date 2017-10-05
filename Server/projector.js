/**
 * All functions to be passed to the projector
 * @module Projector
 */

//the websocket reference of the projector, set by server
exports.ws = null;

//whether we have finished running whatever function the server passes us
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

//Tells the front end to increase/decrease the spread
//Dont even try to understand this CSS wizardry just accept that it works plz
exports.spread = function(spread) {
  funct = function (spread) {
    // console.log('spreading ' + spread);
    var mask = document.getElementById('mask');
    var increment = parseInt(window.getComputedStyle(mask)['-webkit-mask-size']) < spread ? 2 : -2;
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var spreading = setInterval(function() {
      var currentSpread = parseInt(window.getComputedStyle(mask)['-webkit-mask-size'].substring(0, window.getComputedStyle(mask)['-webkit-mask-size'].length-2));
      var xy = window.getComputedStyle(mask)['-webkit-mask-position'];
      var currentX = parseInt(xy.substring(0, xy.indexOf('p')));
      var currentY = parseInt(xy.substring(xy.indexOf('x')+1, xy.length-2));
      console.log(currentX, currentY, increment);

      if((increment > 0 && currentSpread < spread)|| (increment < 0 && currentSpread > spread)) {
        mask.style['-webkit-mask-size'] = (currentSpread + increment) + 'px';

        var x = 100*(currentX - (increment/2))/w;
        var y = 100*(currentY - (increment/2))/h;
        console.log(x, y);
        mask.style['-webkit-mask-position'] = x + 'vw ' + y + 'vh';
      } else {
        send({done: true});
        clearInterval(spreading);
      }
    }, 100);


  }

  var data = {callback: funct.toString(), args: {spread: spread}};
  send(data);
}

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
