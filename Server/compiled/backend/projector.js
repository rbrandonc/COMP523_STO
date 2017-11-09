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
exports.spread = function (amount) {
    var updateMap = setInterval(function (amount) {
        var added = 0;
        for (var _i = 0, spreadData_1 = spreadData; _i < spreadData_1.length; _i++) {
            var point = spreadData_1[_i];
            if (added < 10 && Math.random() > .5) {
                var p = [
                    (100 * (Math.random() - .5)) + point[0],
                    (100 * (Math.random() - .5)) + point[1],
                    .05
                ];
                spreadData.push(p);
                added++;
            }
        }
        var funct = function (amount, spreadData) {
            var canvas = document.getElementById('canvas');
            var heat = simpleheat(canvas);
            heat.data(spreadData);
            heat.draw();
            if (amount < spreadData.length)
                send({ done: true });
        };
        var data = { callback: funct.toString(), args: { amount: amount, spreadData: spreadData } };
        send(data);
        if (amount < spreadData.length)
            clearInterval(updateMap);
    }, 100);
};
exports.initialize = function () {
    for (var j = 1; j < 10; j += 1) {
        var item = [400 * Math.random(), Math.random() * 400, Math.random()];
        spreadData.push(item);
    }
    var funct = function (spreadData) {
        var canvas = document.getElementById('canvas');
        var heat = simpleheat(canvas);
        heat.data(spreadData);
        heat.gradient({ 0.0: 'rgb(150, 255, 0)', 0.5: 'rgb(255, 237, 0)', 1: 'rgb(255, 0, 0)' });
        heat.resize();
        heat.radius(10, 25);
        heat.draw();
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { spreadData: spreadData } };
    send(data);
};
//# sourceMappingURL=projector.js.map