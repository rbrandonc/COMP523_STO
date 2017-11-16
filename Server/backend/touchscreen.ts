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
//list of tools
// var tools = {'mda': {selected: false, name:'Mass Drug Administration',price:'$300', ratio:'4'}, 'irs': {selected: false, name:'Household Spraying',price:'$100', ratio:'3'}, 'deet': {selected: false, name:'Insect Repellent',price:'$200', ratio:'3'},
//     'clothing': {selected: false, name:'Clothing',price:'$5000', ratio:'3'}, 'bed_netting': {selected: false, name:'Bed Nets',price:'$400', ratio:'4'}, 'gin': {selected: false, name:'Drink gin and tonics',price:'$4000', ratio:'0'},
//     'mosquito_repellant':{selected:false, name:'Ultrasonic mosquito repellant',price:'$3000',ratio:'3'},'mangoes':{selected:false,name:"Don't eat mangoes",price:'$100',ratio:'0'}
// };


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


<<<<<<< HEAD
//Update Price Panel
exports.updatePanel = function(buttonID:any,state:any){
  var funct = function(buttonID:any,state:any){
      var panel = document.getElementById('toolPanel');
      if (panel.childNodes[1]!=null) {
          panel.removeChild(panel.childNodes[1]);
          //console.log();
      }
      if(state.tools[buttonID].selected ==true){
          var div = document.createElement('div');
          var p = document.createTextNode('Price: ' + state.tools[buttonID].price);
          var newLine = document.createElement('br');
          div.className = 'info';
          var r = document.createTextNode('Impact Ratio: ' + state.tools[buttonID].ratio)
          panel.style.visibility = 'visible';

          div.appendChild(p);
          div.appendChild(newLine);
          div.appendChild(r);
          panel.appendChild(div);
      }
      send({done:true});
  };

  var data = {callback:funct.toString(),args:{buttonID:buttonID,state:state}};
  send(data);
=======
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
exports.updatePanel = function(buttonID: any, numberOfSelectedTools: any, state: any){
    var funct = function(buttonID: any){
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
>>>>>>> master
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
  };

  var data = {callback: funct.toString(), args: {}};
  send(data);
};

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
