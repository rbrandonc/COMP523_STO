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
exports.updatePanel = function (buttonID, numberOfSelectedTools, state) {
    var funct = function (buttonID) {
        var panel = document.getElementById("toolPanel");
        panel.style.visibility = 'visible';
        if (numberOfSelectedTools == 0 && panel.childNodes[1] != null) {
            panel.removeChild(panel.childNodes[1]);
        }
        switch (buttonID) {
            case 'bug_rep':
                var div = document.createElement("div");
                var price = document.createTextNode("Price: $10 ");
                var newLine = document.createElement("br");
                div.className = "info";
                var ratio = document.createTextNode("Impact ratio: ");
                if (panel.childNodes[1] != null) {
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if (panel.childNodes[1] != null && !state) {
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'insecticide':
                var div = document.createElement("div");
                var price = document.createTextNode("Price: $15 ");
                var newLine = document.createElement("br");
                div.className = "info";
                var ratio = document.createTextNode("Impact ratio: ");
                if (panel.childNodes[1] != null) {
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if (panel.childNodes[1] != null && !state) {
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'gen_modi_mos':
                var div = document.createElement("div");
                var price = document.createTextNode("Price: $100 ");
                var newLine = document.createElement("br");
                div.className = "info";
                var ratio = document.createTextNode("Impact ratio: ");
                if (panel.childNodes[1] != null) {
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if (panel.childNodes[1] != null && !state) {
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'bed_netting':
                var div = document.createElement("div");
                var price = document.createTextNode("Price: $18 ");
                var newLine = document.createElement("br");
                div.className = "info";
                var ratio = document.createTextNode("Impact ratio: ");
                if (panel.childNodes[1] != null && !state) {
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if (panel.childNodes[1] != null && !state) {
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'vaccine_trial':
                var div = document.createElement("div");
                var price = document.createTextNode("Price: $30 ");
                var newLine = document.createElement("br");
                div.className = "info";
                var ratio = document.createTextNode("Impact ratio: ");
                if (panel.childNodes[1] != null) {
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if (panel.childNodes[1] != null && !state) {
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
            case 'anti_mal_medi':
                var div = document.createElement("div");
                var price = document.createTextNode("Price: $25 ");
                var newLine = document.createElement("br");
                div.className = "info";
                var ratio = document.createTextNode("Impact ratio: ");
                if (panel.childNodes[1] != null) {
                    panel.removeChild(panel.childNodes[1]);
                }
                div.appendChild(price);
                div.appendChild(newLine);
                div.appendChild(ratio);
                panel.appendChild(div);
                console.log(panel.childNodes[1]);
                if (panel.childNodes[1] != null && !state) {
                    panel.removeChild(panel.childNodes[1]);
                }
                break;
        }
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: {} };
    send(data);
};
exports.toggleButtonSelected = function (buttonID, state) {
    var funct = function (buttonID, state) {
        document.getElementById(buttonID).style.backgroundColor = state ? '#7FFF00' : '#F5F5DC';
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
exports.showTools = function () {
    var funct = function () {
        document.getElementById('tools').style.visibility = 'visible';
        document.getElementById('outbreakTypes').style.visibility = 'hidden';
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: {} };
    send(data);
};
exports.reset = function () {
    var funct = function (arg1, arg2) {
        var buttons = Array.prototype.slice.call(document.getElementsByTagName('button'));
        console.log(buttons);
        for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
            var button = buttons_1[_i];
            button.style.backgroundColor = "#F5F5DC";
        }
        document.getElementById('confirm').style.backgroundColor = "#F5F5DC";
        document.getElementById('confirm').style.visibility = 'hidden';
        send({ done: true });
    };
    var data = { callback: funct.toString(), args: {} };
    send(data);
};
//# sourceMappingURL=touchscreen.js.map