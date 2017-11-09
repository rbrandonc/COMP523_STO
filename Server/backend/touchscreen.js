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
    console.log('touchscreen not connected');
  }
}

//Unique functions

// setColor(clicked_button_id);
// confirmChosenTool(chose_tool_num);
// console.log(button_tracker);
// if(chose_tool_num == 2 && button_tracker['confirm'] === true){
//     sendMsg('playVideo');
// }

// function confirmChosenTool(chose_tool_num){
//     console.log(chose_tool_num);
//     var elems = document.getElementsByClassName('col-6');
//     if(chose_tool_num === 2){
//         setTitle('You chose 2 tools');
//         for (var i = 0; i != elems.length; ++i){
//             if(!button_tracker[elems[i].id]){
//                 elems[i].disabled=true;
//             }
//             if(elems[i].id === 'confirm'){
//                 elems[i].disabled=false;
//             }
//         }
//     }else{
//         setTitle('Please choose '+ (2-chose_tool_num)+' more tool(s)')
//         for (var i = 0; i != elems.length; ++i){
//             if(!button_tracker[elems[i].id]){
//                 elems[i].disabled=false;
//             }
//             if(elems[i].id === 'confirm'){
//                 elems[i].disabled=true;
//             }
//         }
//     }
// }
exports.updatePanel = function(buttonID,numberOfSelectedTools,state){
    funct = function(buttonID){
        var panel = document.getElementById("toolPanel");
        panel.style.visibility = 'visible';
        if(numberOfSelectedTools == 0 && panel.childNodes[1]!=null){
            panel.removeChild(panel.childNodes[1]);
        }
        switch(buttonID){
            case 'bug_rep':
                var div = document.createElement("div")
                var price = document.createTextNode("Price: $10 ");
                var newLine = document.createElement("br");
                div.className="info";
                var ratio = document.createTextNode("Impact ratio: ");
                if(panel.childNodes[1]!=null){
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if(panel.childNodes[1]!=null && !state){
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'insecticide':
                var div = document.createElement("div")
                var price = document.createTextNode("Price: $15 ");
                var newLine = document.createElement("br");
                div.className="info";
                var ratio = document.createTextNode("Impact ratio: ");
                if(panel.childNodes[1]!=null){
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if(panel.childNodes[1]!=null && !state){
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'gen_modi_mos':
                var div = document.createElement("div")
                var price = document.createTextNode("Price: $100 ");
                var newLine = document.createElement("br");
                div.className="info";
                var ratio = document.createTextNode("Impact ratio: ");
                if(panel.childNodes[1]!=null){
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if(panel.childNodes[1]!=null && !state){
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'bed_netting':
                var div = document.createElement("div")
                var price = document.createTextNode("Price: $18 ");
                var newLine = document.createElement("br");
                div.className="info";
                var ratio = document.createTextNode("Impact ratio: ");
                if(panel.childNodes[1]!=null && !state){
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if(panel.childNodes[1]!=null &&!state){
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'vaccine_trial':
                var div = document.createElement("div")
                var price = document.createTextNode("Price: $30 ");
                var newLine = document.createElement("br");
                div.className="info";
                var ratio = document.createTextNode("Impact ratio: ");
                if(panel.childNodes[1]!=null){
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if(panel.childNodes[1]!=null && !state){
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'anti_mal_medi':
                var div = document.createElement("div")
                var price = document.createTextNode("Price: $25 ");
                var newLine = document.createElement("br");
                div.className="info";
                var ratio = document.createTextNode("Impact ratio: ");
                if(panel.childNodes[1]!=null){
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if(panel.childNodes[1]!=null && !state){
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
        }
        send({done: true});
    };
    var data = {callback: funct.toString(), args: {}};
    send(data);

};

//Toggle the state of the selected tool button
exports.toggleButtonSelected = function(buttonID, state) {
  funct = function(buttonID, state) {
    // console.log(buttonID, state);
    document.getElementById(buttonID).style.backgroundColor = state ? '#7FFF00' : '#F5F5DC';
    send({done: true});
  };

  var data = {callback: funct.toString(), args: {buttonID: buttonID, state: state}};
  send(data);
};

exports.toggleButtonVisibility = function(buttonID, state) {
  funct = function(buttonID, state) {
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

  funct = function(){
    document.getElementById('tools').style.visibility='visible';
    document.getElementById('outbreakTypes').style.visibility='hidden';
    // document.getElementById('confirm').disabled=true;
    send({done: true});
  }

  var data = {callback: funct.toString(), args: {}};
  send(data);
}

exports.reset = function() {

  funct = function (arg1, arg2) {
    // This is where all your stuff goes
    var buttons = document.getElementsByTagName('button');
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

//Reset the touchscreen
function reset(){
    for(var i = 0; i != elems.length; ++i)
    {
        if(elems[i].id != 'confirm'){

            elems[i].disabled=false;
        }
        elems[i].style.visibility = "visible"; // hidden has to be a string

    }
    document.getElementById('bug_resistance').style.visibility='hidden';
    document.getElementById('ins_resistance').style.visibility='hidden';
    //document.getElementById('confirm').disabled=true;
    setTitle("Choose two tools")

    chose_tool_num = 0;
    setTracker();
    round++;
}
