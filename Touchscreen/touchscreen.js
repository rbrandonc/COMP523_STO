var ws = new WebSocket('ws://' + 'localhost' + ':8080');

var connected = false;
var id = "touchscreen";
//button events

//Do this when we finish loading the DOM
document.addEventListener("DOMContentLoaded", function(event) {
    //Add a handler to one of the buttons
    document.getElementById('debug').onclick=function() {
        //send a simple click event over websocket when div is clicked
        var click = {eventType: 'buttonClick', buttonID: 'debug'};
        this.send(click);
        // var popup = document.getElementById("debugPopup");
        // popup.classList.toggle("show");
        // console.log("Clicked!");
    }.bind(this);

    document.getElementById('bug_resistance').onclick=function(){
        var click = {eventType: 'buttonClick', buttonID: 'bug_resistance'};
        this.send(click);
        var elems = document.getElementsByClassName('col-6');
        for(var i = 0; i != elems.length; ++i)
        {
            elems[i].style.visibility = "visible"; // hidden has to be a string
        }
        document.getElementById("bug_resistance").style.visibility='hidden';
        document.getElementById("ins_resistance").style.visibility='hidden';


    }.bind(this);

    document.getElementById('ins_resistance').onclick=function(){
        var click = {eventType: 'buttonClick', buttonID: 'ins_resistance'};
        this.send(click);
        var elems = document.getElementsByClassName('col-6');
        for(var i = 0; i != elems.length; ++i)
        {
            elems[i].style.visibility = "visible"; // hidden has to be a string
        }
        document.getElementById("bug_resistance").style.visibility='hidden';
        document.getElementById("ins_resistance").style.visibility='hidden';
        //document.getElementsByClassName('col-6').style.visibility='visible';
    }.bind(this);
}.bind(this));

ws.onopen = function(){
    setTitle("Connected to touchscreen");
};

ws.onclose = function(){
    setTitle("Disconnected");
};

function setTitle(title){
    document.querySelector('h1').innerHTML = title;
}

//When the server sends us something
ws.onmessage = function(event) {
    //Server asks us to identify on first connection, send it a blank message
    // if(JSON.parse(event.data).identify) {
    //   send({});
    // }
    console.log(event.data === 'Start the game');
    if(event.data === 'Start the game'){
        var bug = document.getElementById("bug_resistance");
        var ins = document.getElementById("ins_resistance");
        bug.style.visibility='visible';
        ins.style.visibility='visible';
    }
};


//append our id to all the data we send
var send = function(data) {
    data.id = this.id;
    ws.send(JSON.stringify(data));

}