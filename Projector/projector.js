var ws = new WebSocket('ws://' + 'localhost' + ':8080');
var id = 'projector';

//When the server sends us something
ws.onmessage = function(event) {
  data = JSON.parse(event.data);
  console.log(data.spread);

  if(data.spread) {
    spread(data.spread);
  }

  //Server asks us to identify on first connection, send it a blank message
  if(data.identify) {
    console.log('asdfasdf');
    send({});
  }
};

//append our id to all the data we send
var send = function(data) {
  data.id = this.id;
  ws.send(JSON.stringify(data));
}

var spread = function(spread) {
  console.log('spreading ' + spread);
  var mask = document.getElementById('mask');
  var increment = parseInt(window.getComputedStyle(mask)['-webkit-mask-size']) < spread ? 10 : -10;

  var spreading = setInterval(() => {
    var currentSpread = parseInt(window.getComputedStyle(mask)['-webkit-mask-size'].substring(0, window.getComputedStyle(mask)['-webkit-mask-size'].length-2));
    var xy = window.getComputedStyle(mask)['-webkit-mask-position'];
    var currentX = parseInt(xy.substring(0, xy.indexOf('p')));
    var currentY = parseInt(xy.substring(xy.indexOf('x')+1, xy.length-2));

    if((increment > 0 && currentSpread < spread)|| (increment < 0 && currentSpread > spread)) {
      mask.style['-webkit-mask-size'] = (currentSpread + increment) + 'px';

      var x = currentX - (increment/2);
      var y = currentY - (increment/2);
      mask.style['-webkit-mask-position'] = x + 'px ' + y + 'px';
    } else {
      clearInterval(spreading);
    }
    console.log(currentX, currentY, increment)

  }, 100);
}

document.addEventListener('DOMContentLoaded', function(event) {
  // spread(500)
  // setTimeout(() => {spread(900)}, 8000);
  // setTimeout(() => {spread(200)}, 16000);

});
