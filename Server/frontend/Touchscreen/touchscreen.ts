/**
 * Dumb front end, runs functions passed to it by the server
 * and tells the server when we click a button
 * @module FrontEndTouchscreen
 */


/** @type {WebSocket} Websocket reference */
var ws = new WebSocket('ws://' + 'localhost' + ':8080');
/** @type {String} Screen ID */
var id = 'touchscreen';
var listeners = false;


//list of tools
var tools = [{id:'mda',selected: false, name:'Mass Drug Administration',price:'$300', ratio:'4'}, {id:'irs',selected: false, name:'Household Spraying',price:'$100', ratio:'3'}, {id:'deet',selected: false, name:'Insect Repellent',price:'$200', ratio:'3'},
    {id:'clothing',selected: false, name:'Clothing',price:'$5000', ratio:'3'}, {id:'bed_netting',selected: false, name:'Bed Nets',price:'$400', ratio:'4'}, {id:'gin',selected: false, name:'Drink gin and tonics',price:'$4000', ratio:'0'},
    {id:'mosquito_repellant',selected:false, name:'Ultrasonic mosquito repellant',price:'$3000',ratio:'3'},{id:'mangos',selected:false,name:"Don't eat mangoe",price:'$100',ratio:'0'}];

//shuffle tools
function shuffle(){
    for(var j, x, i = tools.length; i; j = Math.floor(Math.random() * i), x = tools[--i], tools[i] = tools[j], tools[j] = x);
};

/*function shuffle(){
    var currentIndex = 7, temporaryValue, randomIndex;
    //while there remain elements to shuffle
    while(currentIndex!=0){
        randomIndex = Math.floor(Math.random()*currentIndex);
        currentIndex -= 1;
        //swap it with the current element
        temporaryValue = tools[currentIndex];
        tools[currentIndex] = tools[randomIndex];
        tools[randomIndex] = temporaryValue;
    }
    return tools;
}
*/

console.log(tools);

function initialize_tools(){
    shuffle();
    var buttons = document.getElementsByClassName('tool');
    console.log(buttons[0]);
    console.log(tools[0].name);
    var count =0;
    while(count <4){
        buttons[count].setAttribute('id',tools[count].id);
        console.log(tools[count].id);
        buttons[count].innerHTML= tools[count].name;
        count++;
    }
}

//set button click handlers
document.addEventListener("DOMContentLoaded", function(event) {
  var buttons = document.getElementsByTagName('button');
  console.log("finished loading");
  //If a button is clicked, send the ID to the server
  for (var i = 0; i != buttons.length; ++i){
    if(!listeners) {
      buttons[i].addEventListener("click", function(){
        console.log('button click: ' + this.id);
        var data = { buttonID: this.id };
        send(data);
      });
    }
  }
  listeners = true;
});

/** Either identify ourself or run the function send by the server if it exists */
ws.onmessage = function(event) {
  var data = JSON.parse(event.data);

  /** Server asks us to identify on first connection, send it a blank message */
  if(data.identify) {
    setTimeout(send({}), 1000);

  }

  if(data.callback) {
    //Create a function from the string of the function the server gave us
    //with the arguments passed in data.args
    //then execute it with the value of the args
    var f = Function(...Object.keys(data.args), data.callback);
    f(...Object.values(data.args));
  }

};

/** Send a message to the server */
var send = function(data: any) {
  data.id = this.id;
  ws.send(JSON.stringify(data));
}
