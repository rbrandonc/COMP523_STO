var _this = this;
exports.ws = null;
exports.busy = false;
var send = function (data) {
    var stuffToSend = { callback: String, args: Object };
    if (_this.ws) {
        if (data.callback) {
            stuffToSend.callback = data.callback.slice(data.callback.indexOf("{") + 1, data.callback.lastIndexOf("}"));
            if (data.args) {
                stuffToSend.args = data.args;
            }
        }
        _this.ws.send(JSON.stringify(stuffToSend));
        _this.busy = true;
    }
    else {
        console.log('touchscreen not connected');
    }
};
exports.showShortTerm = function (tools) {
    var temp = Object.keys(tools);
    var temp2 = {};
    var count = 0;
    for (var j, x, i = temp.length; i; j = Math.floor(Math.random() * i), x = temp[--i], temp[i] = temp[j], temp[j] = x)
        ;
    for (var k = 0; k < temp.length; k++) {
        if (tools[temp[k]].term == 'short') {
            temp2[temp[k]] = tools[temp[k]];
            count++;
        }
        if (count >= 4) {
            break;
        }
    }
    console.log(temp2);
    var funct = function (tools) {
        console.log(tools);
        var buttons = document.getElementsByClassName('tool');
        var keys = Object.keys(tools);
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('id', keys[i]);
            buttons[i].children[0].innerHTML = tools[keys[i]].name;
            buttons[i].children[1].setAttribute('src', '/Touchscreen/res/' + keys[i] + '.jpg');
        }
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { tools: temp2 } };
    send(data);
};
exports.showLongTerm = function (tools) {
    var temp = Object.keys(tools);
    var temp2 = {};
    var count = 0;
    for (var j, x, i = temp.length; i; j = Math.floor(Math.random() * i), x = temp[--i], temp[i] = temp[j], temp[j] = x)
        ;
    for (var k = 0; k < temp.length; k++) {
        if (tools[temp[k]].term == 'long') {
            temp2[temp[k]] = tools[temp[k]];
            count++;
        }
        if (count >= 4) {
            break;
        }
    }
    console.log(temp2);
    var funct = function (tools) {
        console.log(tools);
        var buttons = document.getElementsByClassName('tool');
        var keys = Object.keys(tools);
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute('id', keys[i]);
            buttons[i].children[0].innerHTML = tools[keys[i]].name;
            buttons[i].children[1].setAttribute('src', '/Touchscreen/res/' + keys[i] + '.jpg');
        }
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { tools: temp2 } };
    send(data);
};
exports.updatePanel = function (buttonID, state) {
    var funct = function (buttonID, state) {
        var panel = document.getElementById('toolPanel');
        if (panel.childNodes[1] != null) {
            panel.removeChild(panel.childNodes[1]);
        }
        var div = document.createElement('div');
        var b = document.createTextNode('Budget: $' + state.budget);
        div.appendChild(b);
        if (state.tools[buttonID].selected == true) {
            var p = document.createTextNode('Price: $' + state.tools[buttonID].price + ' ');
            var newLine = document.createElement('br');
            div.className = 'info';
            var r = document.createTextNode('Impact Ratio: ' + state.tools[buttonID].ratio + ' ');
            panel.style.visibility = 'visible';
            var bt1 = document.createElement('button');
            bt1.innerHTML = 'small';
            bt1.setAttribute('class', 'package');
            bt1.setAttribute('id', '1');
            var bt2 = document.createElement('button');
            bt2.innerHTML = 'medium';
            bt2.setAttribute('class', 'package');
            bt2.setAttribute('id', '2');
            var bt3 = document.createElement('button');
            bt3.innerHTML = 'large';
            bt3.setAttribute('class', 'package');
            bt3.setAttribute('id', '3');
            div.appendChild(p);
            div.appendChild(newLine);
            div.appendChild(r);
            div.appendChild(newLine);
            div.appendChild(bt1);
            div.appendChild(bt2);
            div.appendChild(bt3);
            panel.appendChild(div);
            var packages = document.getElementsByClassName('package');
            var price = state.tools[buttonID].price;
            var pre_price = 0;
            for (var i = 0; i < 3; i++) {
                packages[i].addEventListener("click", function () {
                    console.log(this);
                    price = Math.floor(state.tools[buttonID].price * (this.id / 3));
                    p.nodeValue = 'Price: $' + price.toString();
                    state.budget += pre_price;
                    state.budget -= price;
                    b.nodeValue = 'Budget: $' + (state.budget).toString();
                    console.log(state.budget.toString());
                    pre_price = price;
                    send({ package: { package: this.id, buttonID: buttonID } });
                    send({ budget: Math.floor(state.budget) });
                });
            }
        }
        else {
            if ((state.budget + (state.tools[buttonID].price * (state.tools[buttonID].package / 3))) <= 15000) {
                state.budget += (state.tools[buttonID].price * (state.tools[buttonID].package / 3));
                b.nodeValue = 'Budget: $' + state.budget.toLocaleString();
                send({ budget: Math.floor(state.budget) });
            }
            panel.appendChild(div);
        }
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { buttonID: buttonID, state: state } };
    send(data);
};
exports.setButtonDisabled = function (buttonID, state) {
    var funct = function (buttonID) {
        document.getElementById('confirm').disabled = state;
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { buttonID: buttonID, state: state } };
    send(data);
};
exports.toggleButtonSelected = function (buttonID, state) {
    var funct = function (buttonID, state) {
        document.getElementById(buttonID).style.border = state ? '1px solid black' : 'none';
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { buttonID: buttonID, state: state } };
    send(data);
};
exports.toggleButtonVisibility = function (buttonID, state) {
    var funct = function (buttonID, state) {
        document.getElementById('' + buttonID).style.visibility = state ? 'visible' : 'hidden';
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { buttonID: buttonID, state: state } };
    send(data);
};
exports.showGameover = function (score) {
    var funct = function (score) {
        console.log(score);
        document.getElementById('gameover').style.visibility = 'visible';
        document.getElementById('score').innerHTML = ' ' + score;
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: { score: score } };
    send(data);
};
exports.hideTools = function () {
    var funct = function () {
        document.getElementById('tools').style.display = 'none';
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: {} };
    send(data);
};
exports.showTools = function () {
    var funct = function () {
        document.getElementById('tools').style.visibility = 'visible';
        document.getElementById('outbreakTypes').style.display = 'none';
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: {} };
    send(data);
};
exports.reset = function () {
    var funct = function (arg1, arg2) {
        var buttons = Array.prototype.slice.call(document.getElementsByClassName('button'));
        console.log(buttons);
        for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
            var button = buttons_1[_i];
            button.style.border = 'none';
        }
        document.getElementById('confirm').disabled = true;
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: {} };
    send(data);
};
//# sourceMappingURL=touchscreen.js.map