var ws = new WebSocket('ws://' + 'localhost' + ':8080');
var id = 'mainscreen';
ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    if (data.identify) {
        send({});
    }
    if (data.callback) {
        var f = Function.apply(void 0, Object.keys(data.args).concat([data.callback]));
        f.apply(void 0, Object.values(data.args));
    }
};
var send = function (data) {
    data.id = this.id;
    ws.send(JSON.stringify(data));
};
//# sourceMappingURL=mainscreen.js.map