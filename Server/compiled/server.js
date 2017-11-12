var WebSocketServer = require('ws').Server;
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();
var wss = new WebSocketServer({ server: server });
app.use(express.static(path.join(__dirname, '/frontend')));
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
            state.isPanelEmpty = event.data.isPanelEmpty;
            return;
        }
        if (event.data.buttonID) {
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
                touchscreen.updatePanel(buttonID, state.tools[buttonID].price, state.tools[buttonID].ratio, state.isPanelEmpty, state.tools[buttonID].selected);
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
            }
            if (buttonID === 'confirm') {
                mainscreen.playVideo(state.tools);
                var spread = 7000;
                projector.spread(spread);
                touchscreen.reset();
                state.numberOfSelectedTools = 0;
                for (var _i = 0, _a = Object.keys(state.tools); _i < _a.length; _i++) {
                    var item = _a[_i];
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
    tools: { 'bug_rep': { selected: false, price: '$10', ratio: '' }, 'insecticide': { selected: false, price: '$20', ratio: '' }, 'gen_modi_mos': { selected: false, price: '$50', ratio: '' },
        'bed_netting': { selected: false, price: '$35', ratio: '' }, 'vaccine_trial': { selected: false, price: '$55', ratio: '' }, 'anti_mal_medi': { selected: false, price: '$13', ratio: '' }
    },
    numberOfSelectedTools: 0,
    isPanelEmpty: true
};
var defaultState = state;
//# sourceMappingURL=server.js.map