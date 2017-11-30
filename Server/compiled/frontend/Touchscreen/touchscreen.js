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
//set button click handlers
document.addEventListener("DOMContentLoaded", function (event) {
    var buttons = document.getElementsByClassName('button');
    //If a button is clicked, send the ID to the server
    for (var i = 0; i != buttons.length; ++i) {
        if (!listeners) {
            buttons[i].addEventListener("click", function () {
                console.log('button click: ' + this.id);
                var data = { buttonID: this.id };
                send(data);
            });
        }
    }
    document.getElementById('submit').addEventListener("click", function () {
        console.log('submitting');
        send({ initials: document.getElementById('initials').value });
    });
    listeners = true;
    console.log("finished loading");
});
/** Either identify ourself or run the function send by the server if it exists */
ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    /** Server asks us to identify on first connection, send it a blank message */
    if (data.identify) {
        setTimeout(send({}), 1000);
    }
    if (data.callback) {
        //Create a function from the string of the function the server gave us
        //with the arguments passed in data.args
        //then execute it with the value of the args
        var f = Function.apply(void 0, Object.keys(data.args).concat([data.callback]));
        f.apply(void 0, Object.values(data.args));
    }
};
/** Send a message to the server */
var send = function (data) {
    data.id = this.id;
    ws.send(JSON.stringify(data));
};
//# sourceMappingURL=touchscreen.js.map