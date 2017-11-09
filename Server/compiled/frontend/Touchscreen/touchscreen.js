var ws = new WebSocket('ws://' + 'localhost' + ':8080');
var id = 'touchscreen';
var listeners = false;
document.addEventListener("DOMContentLoaded", function (event) {
    var buttons = document.getElementsByTagName('button');
    console.log("finished loading");
    for (var i = 0; i != buttons.length; ++i) {
        if (!listeners) {
            buttons[i].addEventListener("click", function () {
                console.log('button click: ' + this.id);
                var data = { buttonID: this.id };
                send(data);
            });
        }
    }
    listeners = true;
});
ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    if (data.identify) {
        setTimeout(send({}), 1000);
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
//# sourceMappingURL=touchscreen.js.map