var ws = new WebSocket('ws://' + 'localhost' + ':8080');
var id = 'touchscreen';
var listeners = false;
var tools = [{ id: 'mda', selected: false, name: 'Mass Drug Administration', price: '$300', ratio: '4' }, { id: 'irs', selected: false, name: 'Household Spraying', price: '$100', ratio: '3' }, { id: 'deet', selected: false, name: 'Insect Repellent', price: '$200', ratio: '3' },
    { id: 'clothing', selected: false, name: 'Clothing', price: '$5000', ratio: '3' }, { id: 'bed_netting', selected: false, name: 'Bed Nets', price: '$400', ratio: '4' }, { id: 'gin', selected: false, name: 'Drink gin and tonics', price: '$4000', ratio: '0' },
    { id: 'mosquito_repellant', selected: false, name: 'Ultrasonic mosquito repellant', price: '$3000', ratio: '3' }, { id: 'mangoes', selected: false, name: "Don't eat mangoes", price: '$100', ratio: '0' }];
function shuffle() {
    for (var j, x, i = tools.length; i; j = Math.floor(Math.random() * i), x = tools[--i], tools[i] = tools[j], tools[j] = x)
        ;
}
;
console.log(tools);
function initialize_tools() {
    shuffle();
    var buttons = document.getElementsByClassName('tool');
    console.log(buttons[0]);
    console.log(tools[0].name);
    var count = 0;
    while (count < 4) {
        buttons[count].setAttribute('id', tools[count].id);
        console.log(tools[count].id);
        buttons[count].innerHTML = tools[count].name;
        count++;
    }
}
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