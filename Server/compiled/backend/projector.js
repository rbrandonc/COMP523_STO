var _this = this;
exports.ws = null;
exports.busy = false;
var simpleheat = require('./simpleheat.js');
var send = function (data) {
    var stuffToSend = { callback: String, args: String };
    if (_this.ws) {
        if (data.callback) {
            stuffToSend.callback = data.callback.slice(data.callback.indexOf("{") + 1, data.callback.lastIndexOf("}"));
            if (data.args) {
                stuffToSend.args = data.args;
            }
        }
        _this.ws.send(JSON.stringify(stuffToSend));
        _this.busy = true;
    }
    else {
        console.log('projector not connected');
    }
};
var spreadData = [];
var spread = 0;
exports.spread = function (amount) {
    var difference = amount - spread;
    var updateMap = setInterval(function () {
        if (difference > 0) {
            var idx = Math.floor(Math.random() * spreadData.length);
            if (spreadData[idx][2] < 1) {
                spreadData[idx][2] += .02;
                spreadData.splice(spreadData.length - 1, 0, spreadData.splice(idx, 1)[0]);
            }
            if (spreadData[idx][2] > .2) {
                var x = Math.floor(spreadData[idx][0] + (100 * (Math.random() - .5)));
                var y = Math.floor(spreadData[idx][1] + (100 * (Math.random() - .5)));
                var p = [x, y, 0.0];
                spreadData.push(p);
            }
        }
        else if (difference < 0) {
            if (spreadData[spreadData.length - 1][2] > 0) {
                spreadData[spreadData.length - 1][2] -= .02;
                spreadData.splice(0, 0, spreadData.splice(spreadData.length - 1, 1)[0]);
            }
            if (spreadData[spreadData.length - 1][2] < .2) {
                spreadData.pop();
            }
        }
        var funct = function (spreadData) {
            var canvas = document.getElementById('canvas');
            var heat = simpleheat(canvas);
            heat.data(spreadData);
            heat.draw(.01);
            send({ done: true });
        };
        var data = { callback: funct.toString(), args: { spreadData: spreadData } };
        send(data);
        if (difference > 0) {
            difference--;
        }
        else if (difference < 0) {
            difference++;
        }
        else {
            console.log("CLEARING MAP UPDATE");
            clearInterval(updateMap);
        }
    }, 10);
};
exports.initialize = function () {
    for (var x = 0; x < 10; x++) {
        var item = [Math.floor(800 * Math.random()), Math.floor(400 * Math.random()), 0.0];
        spreadData.push(item);
    }
    var funct = function (spreadData) {
        var canvas = document.getElementById('canvas');
        var heat = simpleheat(canvas);
        heat.data(spreadData);
        heat.gradient({ 0.0: 'rgb(150, 255, 0)', 0.5: 'rgb(255, 237, 0)', 1: 'rgb(255, 0, 0)' });
        heat.resize();
        heat.radius(15, 25);
        heat.draw(.01);
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { spreadData: spreadData } };
    send(data);
    this.spread(1000);
};
//# sourceMappingURL=projector.js.map