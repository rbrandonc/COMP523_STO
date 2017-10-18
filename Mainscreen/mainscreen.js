var ws = new WebSocket('ws://' + 'localhost' + ':8080');

var connected = false;
var id ="mainscreen";
document.addEventListener("DOMContentLoaded", function(event) {
    //Add a handler to one of the buttons
    document.getElementById('beginning').style.visibility='visible';
    playVideo(document.getElementById('beginning'));
    document.getElementById('start').onclick=function() {
        //send a simple click event over websocket when div is clicked
        var click = {eventType: 'buttonClick', buttonID: 'start'};
        this.send(click);
        console.log("Clicked!");
        document.getElementById('beginning').style.visibility='hidden';

    }.bind(this);

    document.getElementById('skip').onclick=function(){
        document.querySelector('h1').style.visibility='hidden';
        document.getElementById('skip').style.visibility='hidden';
        document.getElementById('bed_netting').style.visibility='hidden';
        pauseVideo(document.getElementById('bed_netting'));
        sendMsg("nextRound");
    }
}.bind(this));


ws.onopen = function(){
    setTitle('Connected to Mainscreen');
};

ws.onclose = function(){
    setTitle('DISCONNECTED');

};

//When the server sends us something
ws.onmessage = function(event) {
    //Server asks us to identify on first connection, send it a blank message
    // if(JSON.parse(event.data).identify) {
    //     send({});
    //
    console.log(event.data);

    if(event.data === 'Start the game'){
        document.getElementById("start").style.visibility='hidden';
        document.querySelector('h1').style.visibility='hidden';
        pauseVideo(document.getElementById('beginning'));
    }

    if(event.data === 'Play the video'){
        document.querySelector('h1').style.visibility='visible';
        document.getElementById('bed_netting').style.visibility='visible';
        playVideo(document.getElementById("bed_netting"));
        setTitle("Playing the video...");
        document.getElementById('skip').style.visibility='visible';
    }

};

function playVideo(vid){
    vid.play();
}

function pauseVideo(vid){
    vid.pause();
    vid.load();
}

function sendMsg(msg){
    var click = {eventType: 'buttonClick', msg: msg};
    this.send(click);
}

function setTitle(title){
    document.querySelector('h1').innerHTML = title;
}

//append our id to all the data we send
var send = function(data) {
    data.id = this.id;
    ws.send(JSON.stringify(data));
}