/**
 * All functions to be passed to the main screen
 * @module Mainscreen
 */

 /** @type {WebSocket} A reference to the websocket, set by server */
exports.ws = null;

/** @type {Boolean} Whether or not we are still running a function passed by the server */
exports.busy = false;

//All functions should look like this
//Call this function from server.js by doing projector.functionName(args)
//it will then be sent to the front end to be executed
// exports.functionName = function(arg1, arg2) {
//
//   funct = function (arg1, arg2) {
//     // This is where all your stuff goes
//
//      EVERY FUNCTION MUST END WITH THIS LINE
//      this tells the server that we finished the function
//      send({done: true});
//   }
//
// Just change this to match whatever arguments your function takes in
//   var data = {callback: funct.toString(), args: {arg1: arg1, arg2, arg2}};
//   send(data);
// }

/** Send something to the projector
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
    console.log('mainscreen not connected');
  }
};

exports.hideBgTitle = function(){
    var funct = function() {
      document.getElementById('bg').style.visibility='hidden';
      send({done: true});
    }
    var data = {callback: funct.toString(), args: {}};
    send(data);
};


exports.playIntervalVideos = function(videos: any) {
    console.log('play');

    var funct = function (videos: any) {
        // This is where all your stuff goes
        var source = document.getElementById('source');
        var i = 0;
        source['src'] = '/' + videos + '.mp4';
        send({done: true});

    };

    var data = {callback: funct.toString(), args: {videos: videos}};
    send(data);
};

exports.playVideo = function(videos: any) {

  var funct = function (videos: any) {
    // This is where all your stuff goes
    var player = document.getElementById('video');
    var source = document.getElementById('source');
    var i = 0;

    player.addEventListener('ended', function() {
      next();
    }, false);

    var next = () => {
      console.log('video should be playing!!!');
      for(let j = i; j <= Object.keys(videos).length; j++) {
        if(videos[Object.keys(videos)[j]].selected) {
          source['src'] = '/' + Object.keys(videos)[j] + '.mp4';
          console.log('telling the player to load the video');
          player['load']();
          i = j+1;

          if(i > Object.keys(videos).length) {
            send({done: true});
          }
          break;
        }
      }
    };

    next();

  };


  var data = {callback: funct.toString(), args: {videos: videos}};
  send(data);
};

var play = (video: any) => {
  var player = document.getElementById('video');
  var source = document.getElementById('source');
};
