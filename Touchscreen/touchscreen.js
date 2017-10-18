var ws = new WebSocket('ws://' + 'localhost' + ':8080');

var connected = false;
var id = "touchscreen";
var chose_tool_num = 0;
var clicked_button_id;
var button_tracker ={};
var round= 1;
//button events

//Do this when we finish loading the DOM
document.addEventListener("DOMContentLoaded", function(event) {
    //Add a handler to one of the buttons

    document.getElementById('bug_resistance').onclick=function(){

        scenario_choose('bug_resistance');

    }.bind(this);

    document.getElementById('ins_resistance').onclick=function(){
        scenario_choose('ins_resistance');
    }.bind(this);

    setTracker();

}.bind(this));

addListeners();

//Add button listeners
function addListeners(){
    document.querySelectorAll(".col-6").forEach(function(elem){
        elem.addEventListener("click" ,function(event){
            clicked_button_id=event.target.id;
            setColor(clicked_button_id);
            confirmChosenTool(chose_tool_num);
            console.log(button_tracker);
            if(chose_tool_num == 2 && button_tracker['confirm'] === true){
                sendMsg('playVideo');
            }
        })
    })
}



function setTracker(){
    var elems = document.getElementsByClassName('col-6');

    for (var i = 0; i != elems.length; ++i){
        button_tracker[elems[i].id] = false;
    }
    button_tracker['confirm'] = false;
}

function confirmChosenTool(chose_tool_num){
    console.log(chose_tool_num);
    var elems = document.getElementsByClassName('col-6');
    if(chose_tool_num === 2){
        setTitle('You chose 2 tools');
        for (var i = 0; i != elems.length; ++i){
            if(!button_tracker[elems[i].id]){
                elems[i].disabled=true;
            }
            if(elems[i].id === 'confirm'){
                elems[i].disabled=false;
            }
        }
    }else{
        setTitle('Please choose '+ (2-chose_tool_num)+' more tool(s)')
        for (var i = 0; i != elems.length; ++i){
            if(!button_tracker[elems[i].id]){
                elems[i].disabled=false;
            }
            if(elems[i].id === 'confirm'){
                elems[i].disabled=true;
            }
        }
    }
}

function  setColor(btn){
    var property = document.getElementById(btn);
    if (!button_tracker[btn] ){
        if(btn!='confirm') {
            chose_tool_num++;
            property.style.backgroundColor = "#7FFF00";
        }
        button_tracker[btn] = true;

    }else {
        if (btn != 'confirm') {
            property.style.backgroundColor = "#F5F5DC";
            chose_tool_num--;
        }
        button_tracker[btn] = false;
    }
}

function setTitle(title){
    document.querySelector('h1').innerHTML = title;
}
function sendMsg(msg){
    var click = {eventType: 'buttonClick', msg: msg};
    this.send(click);
}

function scenario_choose(scenarioID){
    var click = {eventType: 'buttonClick', buttonID: scenarioID};
    this.send(click);
    var elems = document.getElementsByClassName('col-6');
    for(var i = 0; i != elems.length; ++i)
    {
        elems[i].style.visibility = "visible"; // hidden has to be a string
    }
    document.getElementById('bug_resistance').style.visibility='hidden';
    document.getElementById('ins_resistance').style.visibility='hidden';
    document.getElementById('confirm').disabled=true;
    setTitle("Choose two tools")
}

//second round demo
function reset(){
    var elems = document.getElementsByClassName('col-6');
    for(var i = 0; i != elems.length; ++i)
    {
        if(elems[i].id != 'confirm'){
            elems[i].style.backgroundColor="#F5F5DC"
            elems[i].disabled=false;
        }
        elems[i].style.visibility = "visible"; // hidden has to be a string

    }
    document.getElementById('bug_resistance').style.visibility='hidden';
    document.getElementById('ins_resistance').style.visibility='hidden';
    //document.getElementById('confirm').disabled=true;
    setTitle("Choose two tools")

    chose_tool_num = 0;
    setTracker();
    round++;
}

ws.onopen = function(){
    setTitle("Connected to touchscreen");
};

ws.onclose = function(){
    setTitle("Disconnected");
};


//When the server sends us something
ws.onmessage = function(event) {
    //Server asks us to identify on first connection, send it a blank message
    // if(JSON.parse(event.data).identify) {
    //   send({});
    // }
    //console.log(event.data === 'Start the game');
    console.log(event.data);
    if(event.data === 'Start the game'){
        var bug = document.getElementById("bug_resistance");
        var ins = document.getElementById("ins_resistance");
        bug.style.visibility='visible';
        ins.style.visibility='visible';
    }

    if(event.data === 'Start the next round'){
        reset();
    }
};


//append our id to all the data we send
var send = function(data) {
    data.id = this.id;
    ws.send(JSON.stringify(data));

}
