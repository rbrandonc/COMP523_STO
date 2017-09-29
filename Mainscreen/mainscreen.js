var ws = new WebSocket('ws://' + 'localhost' + ':8080');

var connected = false;
var id ="mainscreen";
document.addEventListener("DOMContentLoaded", function(event) {
    //Add a handler to one of the buttons
    document.getElementById('start').onclick=function() {
        //send a simple click event over websocket when div is clicked
        var click = {eventType: 'buttonClick', buttonID: 'start'};
        this.send(click);
        console.log("Clicked!");

    }.bind(this);
}.bind(this));


ws.onopen = function(){
    setTitle("Connected to Mainscreen");
};

ws.onclose = function(){
    setTitle("DISCONNECTED");

};

//When the server sends us something
ws.onmessage = function(event) {
    //Server asks us to identify on first connection, send it a blank message
    // if(JSON.parse(event.data).identify) {
    //     send({});
    //
    console.log(event.data);
};
function setTitle(title){
    document.querySelector('h1').innerHTML = title;
}

//append our id to all the data we send
var send = function(data) {
    data.id = this.id;
    ws.send(JSON.stringify(data));
}