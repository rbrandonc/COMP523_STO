var ws = new WebSocket('ws://' + 'localhost' + ':8080');
ws.name = "touchscreen";

//When the server sends us something
ws.onmessage = function(event) {
  console.log(JSON.parse(event.data));

  if(event.data.time) {
    document.getElementById('time').innerHTML = event.time;
  }
};

document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('debug').onclick=function() {
    //send a simple message over websocket when div is clicked
    ws.send('Button Clicked');
  }
});
