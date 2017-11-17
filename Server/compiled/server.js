var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
var wss = new WebSocketServer({ server: server });
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static('res'));
var projector = require('./backend/projector');
var mainscreen = require('./backend/mainscreen');
var touchscreen = require('./backend/touchscreen');
server.on('request', app);
server.listen(8080, function () {
    console.log('listening on 8080');
    var opn = require('opn');
    opn('http://localhost:8080');
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/frontend/main.html');
});
var log = setInterval(function () {
    console.log('touchscreen: ' + (touchscreen.ws ? 'connected ' + (touchscreen.busy ? '(busy)' : '(idle)') : ''), ' projector: ' + (projector.ws ? 'connected ' + (projector.busy ? '(busy)' : '(idle)') : ''), ' mainscreen: ' + (mainscreen.ws ? 'connected ' + (mainscreen.busy ? '(busy)' : '(idle)') : ''));
}, 2000);
wss.on('connection', function (ws) {
    var data = { identify: true };
    ws.send(JSON.stringify(data));
    ws.onmessage = function (event) {
        event.data = JSON.parse(event.data);
        console.log(event.data);
        touchscreen.ws = event.data.id === "touchscreen" ? ws : touchscreen.ws;
        mainscreen.ws = event.data.id === "mainscreen" ? ws : mainscreen.ws;
        projector.ws = event.data.id === "projector" ? ws : projector.ws;
        if (projector.ws != undefined && state.initialized == false) {
            projector.initialize();
            state.initialized = true;
        }
        if (event.data.done) {
            eval(event.data.id + '.busy' + ' = ' + false);
            return;
        }
        if (event.data.buttonID) {
            console.log(JSON.stringify(data));
            var buttonID = event.data.buttonID;
            if (state.tools[buttonID] !== undefined) {
                state.tools[buttonID].selected = !state.tools[buttonID].selected;
                if (state.tools[buttonID].selected) {
                    state.numberOfSelectedTools++;
                }
                else {
                    state.numberOfSelectedTools--;
                }
                ;
                touchscreen.toggleButtonSelected(buttonID, state.tools[buttonID].selected);
                touchscreen.updatePanel(buttonID, state);
                if (state.numberOfSelectedTools == 2) {
                    touchscreen.toggleButtonVisibility('confirm', true);
                }
                else if (state.numberOfSelectedTools > 2) {
                    state.tools[buttonID].selected = !state.tools[buttonID].selected;
                    if (state.tools[buttonID].selected) {
                        state.numberOfSelectedTools++;
                    }
                    else {
                        state.numberOfSelectedTools--;
                    }
                    ;
                    touchscreen.toggleButtonSelected(buttonID, state.tools[buttonID].selected);
                }
                else {
                    touchscreen.toggleButtonVisibility('confirm', false);
                }
            }
            if (buttonID === 'vac_resistant' || buttonID === 'ins_resistant') {
                state['outbreakType'] = buttonID;
                touchscreen.showTools();
                mainscreen.hideBgTitle();
            }
            if (buttonID === 'confirm') {
                mainscreen.playVideo(state.tools);
                var ratio = 0;
                for (var _i = 0, _a = Object.keys(state.tools); _i < _a.length; _i++) {
                    var t = _a[_i];
                    if (state.tools[t].selected) {
                        ratio += state.tools[t].ratio;
                    }
                }
                ratio = (ratio - .5) * (-1);
                var spread = Math.floor(ratio * 1000);
                console.log(ratio + ' ' + spread);
                projector.spread(spread);
                touchscreen.reset();
                state.numberOfSelectedTools = 0;
                for (var _b = 0, _c = Object.keys(state.tools); _b < _c.length; _b++) {
                    var item = _c[_b];
                    state.tools[item].selected = false;
                }
            }
        }
    };
    ws.on('close', function () {
        console.log('closing');
    });
});
var state = {
    initialized: false,
    outbreakTypes: ['ins_resistance', 'vaccine_resistance'],
    outbreakType: false,
    tools: {
        'mda': {
            name: 'Mass Drug Administration',
            selected: false,
            price: 300,
            ratio: '.6'
        },
        'irs': {
            selected: false,
            name: 'Household Spraying',
            price: 100,
            ratio: '.4'
        },
        'deet': {
            selected: false,
            name: 'Insect Repellent',
            price: 200,
            ratio: '.4'
        },
        'clothing': {
            selected: false,
            name: 'Clothing',
            price: 5000,
            ratio: '.2'
        },
        'bed_netting': {
            selected: false,
            name: 'Bed Nets',
            price: 400,
            ratio: '.4'
        },
        'gin': {
            selected: false,
            name: 'Drink gin and tonics',
            price: 4000,
            ratio: '0'
        },
        'mosquito_repellant': {
            selected: false,
            name: 'Ultrasonic mosquito repellant',
            price: 3000,
            ratio: '.2'
        },
        'mangos': {
            selected: false,
            name: 'Don\'t eat mangos',
            price: 100,
            ratio: '0'
        }
    },
    numberOfSelectedTools: 0
};
//# sourceMappingURL=server.js.map