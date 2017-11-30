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

var last_price = 0;



//Update Price Panel
exports.updatePanel = function(buttonID: any, state: any) {
  var funct = function(buttonID: any, state: any) {
      var panel = document.getElementById('toolPanel');
      if (panel.childNodes[1]!=null) {
          panel.removeChild(panel.childNodes[1]);
          //console.log();
      }
      var div = document.createElement('div');
      var b = document.createTextNode('Budget: $'+state.budget);
      div.appendChild(b);


      if(state.tools[buttonID].selected == true){
          //var div = document.createElement('div');
          var p = document.createTextNode('Price: $' + state.tools[buttonID].price);
          var newLine = document.createElement('br');
          div.className = 'info';
          var r = document.createTextNode('Impact Ratio: ' + state.tools[buttonID].ratio);
          panel.style.visibility = 'visible';
          var bt1 = document.createElement('button');
          bt1.innerHTML='small'; bt1.setAttribute('class','package'); bt1.setAttribute('id','1');
          var bt2 = document.createElement('button');
          bt2.innerHTML='medium'; bt2.setAttribute('class','package'); bt2.setAttribute('id','2');
          var bt3 = document.createElement('button');
          bt3.innerHTML='large'; bt3.setAttribute('class','package'); bt3.setAttribute('id','3');

          div.appendChild(p);
          div.appendChild(newLine);
          div.appendChild(r);
          div.appendChild(newLine);
          div.appendChild(bt1);
          div.appendChild(bt2);
          div.appendChild(bt3);
          panel.appendChild(div);

          var packages = document.getElementsByClassName('package');
          var price = state.tools[buttonID].price;

          //b.nodeValue='Budget: $' + (state.budget-price).toString();

          var pre_price = 0;

          for(var i=0;i<3;i++){
              packages[i].addEventListener("click",function(){
                  console.log(this);
                  price = Math.floor(state.tools[buttonID].price * (this.id / 3));
                  //update price
                  p.nodeValue='Price: $' + price.toString();
                  //initial condition
                  state.budget+=pre_price;
                  state.budget-=price;
                  b.nodeValue='Budget: $' + (state.budget).toString();
                  console.log(state.budget.toString());

                  pre_price=price;
                  last_price=pre_price;

                  //update package
                  send({package:{package:this.id,buttonID:buttonID}});
                  //update budget
                  //console.log(Math.floor(state.budget));
                  send({budget:Math.floor(state.budget)});

              })
          }
      }else{
          if((state.budget +(state.tools[buttonID].price*(state.tools[buttonID].package/3)))<=15000) {
              state.budget += (state.tools[buttonID].price*(state.tools[buttonID].package/3));
              b.nodeValue = 'Budget: $' + state.budget.toLocaleString();
              //update budget
              //console.log(Math.floor(state.budget));
              send({budget:Math.floor(state.budget)});
          }
          panel.appendChild(div);
      }
      send({done: true});
  };

  var data = {callback:funct.toString(),args:{buttonID:buttonID,state:state}};
  send(data);
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
