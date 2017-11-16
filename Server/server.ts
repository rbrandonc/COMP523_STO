/**
 * @overview This file is the main process.
 * It controls connecting and disconnecting of the screens,
 * passes them functions to run, and does game logic.
 */

// Websocket/express setup
var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
var wss = new WebSocketServer({server: server});
app.use(express.static(path.join(__dirname, '/frontend')));

// References to our screen functions
var projector = require('./backend/projector');
var mainscreen = require('./backend/mainscreen');
var touchscreen = require('./backend/touchscreen');

// Server start listening
server.on('request', app);
server.listen(8080, function () {
  console.log('listening on 8080');
  const opn = require('opn');
  opn('http://localhost:8080');
});

//Serve up the dev screen if we go to localhost:8080/
app.get('/', function (req: any, res: any) {
  res.sendFile(__dirname + '/frontend/main.html');
})

// Screen connection debugging
var log = setInterval(() => {
  console.log('touchscreen: ' + (touchscreen.ws ? 'connected ' + (touchscreen.busy ? '(busy)' : '(idle)'): ''),
              ' projector: ' + (projector.ws ? 'connected '  + (projector.busy ? '(busy)' : '(idle)') : ''),
              ' mainscreen: ' + (mainscreen.ws ? 'connected ' + (mainscreen.busy ? '(busy)' : '(idle)'): ''))
}, 2000);

// This is for detecting if we lose connection to a screen
// Doesn't work but doesn't need to be implemented yet
// function heartbeat() {
//   this.isAlive = true;
// }
// const interval = setInterval(function ping() {
//   wss.clients.forEach(function each(ws) {
//     if (ws.isAlive === false) {
//       this.resetGame();
//       return ws.terminate();
//     }
//
//     ws.isAlive = false;
//     ws.ping('', false, true);
//   });
// }, 1000);

/** When a connection to a screen is made, ask it to identify itself. */
wss.on('connection', function (ws: any) {
  // Also for screen loss detection
  // ws.isAlive = true;
  // ws.on('pong', heartbeat);

  //Ask connection to identify itself
  var data = {identify: true}
  ws.send(JSON.stringify(data));

  /** When the server receives a message from a screen, if it has an ID
   * update our reference to that websocket. If it is a message telling the server
   * the screen is no longer busy, set that screens busy variable to false.
   * If we don't have a connection to any of the three screens, return. If we have
   * All 3 screens or we just had a screen reconnect, initialize the game state
   * and continue the game. */
  ws.onmessage = function(event: any) {
    //Always parse the event data as json
    event.data = JSON.parse(event.data);
    console.log(event.data);

    //Add connection to our list of conncetions
    // TODO: need to reset state if we reconnect a screen
    touchscreen.ws = event.data.id === "touchscreen" ? ws : touchscreen.ws;
    mainscreen.ws = event.data.id === "mainscreen" ? ws : mainscreen.ws;
    projector.ws = event.data.id === "projector" ? ws : projector.ws;

    //initialize spread
    if(projector.ws != undefined && state.initialized == false) {
      projector.initialize();
      state.initialized = true;
    }

    //generate random tools

    //If the frontend is just telling us it finished
    //Set its busy variable to false
    if(event.data.done) {
      eval(event.data.id + '.busy' + ' = ' + false);

      return; }

    //If we are still missing a connection, dont do anything
    // if(!touchscreen.ws || !mainscreen.ws || !projector.ws) { return; }

    //Actual game code goes here


    //If we received a button press event

    if(event.data.buttonID) {
      console.log(JSON.stringify(data));
      var buttonID = event.data.buttonID;
      //If button is one of the tools
      if(state.tools[buttonID] !== undefined) {

        //Toggle the selected state of the tool as long as we have less than two selected tools
        state.tools[buttonID].selected = !state.tools[buttonID].selected;
        if(state.tools[buttonID].selected) { state.numberOfSelectedTools++ } else { state.numberOfSelectedTools-- };
        //Then tell the screen to toggle the button color or whatever
        touchscreen.toggleButtonSelected(buttonID, state.tools[buttonID].selected);
        touchscreen.updatePanel(buttonID,state);

        //state.isPanelEmpty=event.data.isPanelEmpty;
        //If we have two tools selected, show the confirm button
        if(state.numberOfSelectedTools == 2) {
          touchscreen.toggleButtonVisibility('confirm', true);
        } else if(state.numberOfSelectedTools > 2) {
          state.tools[buttonID].selected = !state.tools[buttonID].selected;
          if(state.tools[buttonID].selected) { state.numberOfSelectedTools++ } else { state.numberOfSelectedTools-- };
          //Then tell the screen to toggle the button color or whatever
          touchscreen.toggleButtonSelected(buttonID, state.tools[buttonID].selected);
        } else {
          //If two tools not selected, hide confirm
          touchscreen.toggleButtonVisibility('confirm', false);
        }
      }

      //If the button was outbreak type, show the tool scree
      if(buttonID === 'vac_resistant' || buttonID === 'ins_resistant') {
        state['outbreakType'] = buttonID;
        touchscreen.showTools();
        mainscreen.hideBgTitle();
             }
        //hide mainscreen background


      //If the button was confirm, play the corresponding videos and update the map
      if(buttonID === 'confirm') {
        //play videos
        mainscreen.playVideo(state.tools);

        //calculate spread and animate projector
        var spread = 7000;
        projector.spread(spread);

        //reset touchscreen
        touchscreen.reset();

        //reset gamestate
        state.numberOfSelectedTools = 0;
        for(let item of Object.keys(state.tools)) {
          state.tools[item].selected = false;
        }
      }

    }
  };

  ws.on('close', function () {
    console.log('closing');
    //do this when connection is closed
    // clearInterval(interval);
    // clearInterval(log);
  });
});

/**
 * Game State
 * @class {GameState}
 * @default
 */
var state = {
    initialized: false,
    outbreakTypes: ['ins_resistance', 'vaccine_resistance'],
    outbreakType: false,
    tools: {'mda': {selected: false, name:'Mass Drug Administration',price:'$300', ratio:'\u2605\u2605\u2605\u2605\u2606'}, 'irs': {selected: false, name:'Household Spraying',price:'$100', ratio:'\u2605\u2605\u2605\u2606\u2606'}, 'deet': {selected: false, name:'Insect Repellent',price:'$200', ratio:'\u2605\u2605\u2605\u2606\u2606'},
                  'clothing': {selected: false, name:'Clothing',price:'$5000', ratio:'\u2605\u2605\u2605\u2606\u2606'}, 'bed_netting': {selected: false, name:'Bed Nets',price:'$400', ratio:'\u2605\u2605\u2605\u2605\u2606'}, 'gin': {selected: false, name:'Drink gin and tonics',price:'$4000', ratio:'\u2606\u2606\u2606\u2606\u2606'},
        'mosquito_repellant':{selected:false, name:'Ultrasonic mosquito repellant',price:'$3000',ratio:'\u2605\u2605\u2605\u2606\u2606\u2606'},'mangoes':{selected:false,name:"Don't eat mangoes",price:'$100',ratio:'0'}
                },
    numberOfSelectedTools: 0,
};


var defaultState = state;
