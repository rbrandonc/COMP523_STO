/**
 * All functions to be passed to the touch screen
 * @module Touchscreen
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

//Send something to the projector
//We will only ever send a function and its arguments
var send = (data: any) => {
  var stuffToSend = {callback: String, args: Object};
  if(this.ws) {
    if(data.callback) {
      //We can only send strings so parse the function body as a string
      stuffToSend.callback = data.callback.slice(data.callback.indexOf("{") + 1, data.callback.lastIndexOf("}"));
      if(data.args) { stuffToSend.args = data.args }
    }
    this.ws.send(JSON.stringify(stuffToSend));
    this.busy = true;
  } else {
    console.log('touchscreen not connected');
  }
};


//Update Price Panel
exports.updatePanel = function(buttonID: any, price:any,ratio:any,isPanelEmpty:boolean,selected:boolean){
  var funct = function(buttonID:any, price:any,ratio:any,isPanelEmpty:boolean,selected:boolean){
      console.log(buttonID,price);
      var div = document.createElement('div');
      var p = document.createTextNode('Price: '+price);
      var newLine = document.createElement('br');
      div.className='info';
      var r = document.createTextNode('Impact Ratio: '+ratio);
      var panel=document.getElementById('toolPanel');
      if(!isPanelEmpty){
          panel.removeChild(panel.childNodes[1]);
          isPanelEmpty = true;
          console.log(panel.childNodes[1]);
      }
      div.appendChild(p);
      div.appendChild(newLine);
      div.appendChild(r);
      if(!isPanelEmpty && selected == false){
          panel.removeChild(panel.childNodes[1]);
          isPanelEmpty = true;
      }
      isPanelEmpty = false;
      send({done:true});
  };

  var data = {callback:funct.toString(),args:{buttonID:buttonID,price:price,ratio:ratio,isPanelEmpty:isPanelEmpty,selected:selected}}

};

//Toggle the state of the selected tool button
exports.toggleButtonSelected = function(buttonID: any, state: any) {
  var funct = function(buttonID: any, state: any) {
    // console.log(buttonID, state);
    document.getElementById(buttonID).style.backgroundColor = state ? '#7FFF00' : '#F5F5DC';
    send({done: true});
  };

  var data = {callback: funct.toString(), args: {buttonID: buttonID, state: state}};
  send(data);
};

exports.toggleButtonVisibility = function(buttonID: any, state: any) {
  var funct = function(buttonID: any, state: any) {
    document.getElementById(''+buttonID).style.visibility = state ? 'visible' : 'hidden';
    send({done: true});
  }

  var data = {callback: funct.toString(), args: {buttonID: buttonID, state: state}};
  send(data);
}

// function setTitle(title){
//     document.querySelector('h1').innerHTML = title;
// }
// function sendMsg(msg){
//     var click = {eventType: 'buttonClick', msg: msg};
//     this.send(click);
// }

//We picked the scenario, so hide the scenario buttons and show the tool buttons
exports.showTools = function() {

  var funct = function(){
    document.getElementById('tools').style.visibility='visible';
    document.getElementById('outbreakTypes').style.visibility='hidden';
    // document.getElementById('confirm').disabled=true;
    send({done: true});
  }

  var data = {callback: funct.toString(), args: {}};
  send(data);
}

exports.reset = function() {

  var funct = function (arg1: any, arg2: any) {
    // This is where all your stuff goes
    var buttons = Array.prototype.slice.call(document.getElementsByTagName('button'));
    console.log(buttons)
    for(let button of buttons) {
      button.style.backgroundColor = "#F5F5DC";
    }
    document.getElementById('confirm').style.backgroundColor = "#F5F5DC";
    document.getElementById('confirm').style.visibility='hidden';

     send({done: true});
  }

  var data = {callback: funct.toString(), args: {}};
  send(data);
}

// //Reset the touchscreen
// function reset(){
//     for(var i = 0; i != elems.length; ++i)
//     {
//         if(elems[i].id != 'confirm'){
//
//             elems[i].disabled=false;
//         }
//         elems[i].style.visibility = "visible"; // hidden has to be a string
//
//     }
//     document.getElementById('bug_resistance').style.visibility='hidden';
//     document.getElementById('ins_resistance').style.visibility='hidden';
//     //document.getElementById('confirm').disabled=true;
//     setTitle("Choose two tools")
//
//     chose_tool_num = 0;
//     setTracker();
//     round++;
// }
