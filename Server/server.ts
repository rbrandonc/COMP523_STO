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
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static('res'));

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

// Serve up the dev screen if we go to localhost:8080/
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
//

var s = 0;

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

      return;
    }

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

        //If we have two tools selected, show the confirm button
        if(state.numberOfSelectedTools == 2) {
          touchscreen.setButtonDisabled('confirm', false);
        } else if(state.numberOfSelectedTools > 2) {
          state.tools[buttonID].selected = !state.tools[buttonID].selected;
          if(state.tools[buttonID].selected) { state.numberOfSelectedTools++ } else { state.numberOfSelectedTools-- };
          //Then tell the screen to toggle the button color or whatever
          touchscreen.toggleButtonSelected(buttonID, state.tools[buttonID].selected);
        } else {
          //If two tools not selected, hide confirm
          touchscreen.setButtonDisabled('confirm', true);
        }
      }

      //If the button was outbreak type, show the tool scree
      if(buttonID === 'vac_resistant' || buttonID === 'ins_resistant') {
        state['outbreakType'] = buttonID;
        touchscreen.showTools();
        touchscreen.showShortTerm(state.tools);
        mainscreen.hideBgTitle();
      }
        //hide mainscreen background


      //If the button was confirm, play the corresponding videos and update the map
      if(buttonID === 'confirm') {
        s++;
        if(s == 2) {
          touchscreen.showGameover();
          touchscreen.hideTools();
        }

        //play videos
        mainscreen.playVideo(state.tools);

        //calculate spread and animate projector
        var ratio = 0;
        for(let t of Object.keys(state.tools)) {
          if(state.tools[t].selected){
            ratio += state.tools[t].ratio;
          }
        }
        console.log('ratio ' + ratio)
        ratio = (ratio - .5)*(-1);
        var spread = Math.floor(ratio * 1000);
        console.log(ratio + ' ' + spread)
        projector.spread(spread);

        //reset touchscreen
        touchscreen.reset();
        touchscreen.showLongTerm(state.tools);

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
var state: any = {
    initialized: false,
    outbreakTypes: ['ins_resistance', 'vaccine_resistance'],
    outbreakType: false,
    tools:{
        'mda':{
            name: 'Mass Drug Administration',
            description: 'Replace me',
            selected: false,
            price: 300,
            ratio: .6,
            term: 'short'
        },
        'irs':{
            selected:false,
            name: 'Household Spraying',
            description: 'Replace me',
            price: 100,
            ratio: .4,
            term: 'short'
        },
        'deet': {
            selected: false,
            name: 'Insect Repellent',
            description: 'Replace me',
            price: 200,
            ratio: .4,
            term: 'short'
        },
        'clothing': {
            selected: false,
            name: 'Clothing',
            description: 'Replace me',
            price: 5000,
            ratio: .2,
            term: 'short'
        },
        'bed_netting': {
            selected: false,
            name: 'Bed Nets',
            description: 'Replace me',
            price: 400,
            ratio: .4,
            term: 'short'
        },
        'gin': {
            selected: false,
            name: 'Drink gin and tonics',
            description: 'Replace me',
            price: 4000,
            ratio: 0.0,
            term: 'short'
        },
        'mosquito_repellant': {
            selected: false,
            name :'Ultrasonic mosquito repellant',
            description: 'Replace me',
            price: 3000,
            ratio: 0.0,
            term: 'short'
        },
        'mangos': {
            selected: false,
            name: 'Don\'t eat mangos',
            description: 'Replace me',
            price: 100,
            ratio: 0.0,
            term: 'short'
        },
        'test_treat': {
            selected: false,
            name: 'Rapid Diagnostic Testing',
            description: 'Replace me',
            price: 100,
            ratio: .6,
            term: 'long'
        },
        'env_spraying': {
            selected: false,
            name: 'Insecticide Killer',
            description: 'Replace me',
            price: 1000,
            ratio: .2,
            term: 'long'
        },
        'env_control': {
            selected: false,
            name: 'Environmental Control',
            description: 'Replace me',
            price: 1000,
            ratio: .4,
            term: 'long'
        },
        'fish': {
            selected: false,
            name: 'Larvicidal Fish',
            description: 'Replace me',
            price: 1000,
            ratio: .4,
            term: 'long'
        },
        'vaccine': {
            selected: false,
            name: 'Malaria Vaccine',
            description: 'Replace me',
            price: 100,
            ratio: .2,
            term: 'long'
        },
        'garlic': {
            selected: false,
            name: 'Garlic',
            description: 'Eating garlic will alter your body odor.',
            price: 1000,
            ratio: .4,
            term: 'long'
        },
        'cleaning': {
            selected: false,
            name: 'Clean Up',
            description: 'Avoid contact with dirt.',
            price: 1000,
            ratio: .4,
            term: 'long'
        },
        'clean_water': {
            selected: false,
            name: 'Drink Clean Water',
            description: 'Do not drink dirty water.',
            price: 1000,
            ratio: .4,
            term: 'long'
        },
    },
    numberOfSelectedTools: 0
}


// var defaultState: any = state;
