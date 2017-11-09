var ws = new WebSocket('ws://' + 'localhost' + ':8080');
var id = 'projector';
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
document.addEventListener("DOMContentLoaded", function (event) {
    var canvas = document.getElementById('canvas');
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var canvas = document.getElementById('canvas');
    canvas['height'] = h;
    canvas['width'] = w;
});
//# sourceMappingURL=projector.js.map