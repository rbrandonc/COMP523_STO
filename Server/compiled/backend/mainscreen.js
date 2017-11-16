var _this = this;
exports.ws = null;
exports.busy = false;
var send = function (data) {
    var stuffToSend = { callback: String, args: String };
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
        console.log('mainscreen not connected');
    }
};
exports.playVideo = function (videos) {
    var funct = function (videos) {
        var player = document.getElementById('video');
        var source = document.getElementById('source');
        var i = 0;
        player.addEventListener('ended', function () {
            next();
        }, false);
        var next = function () {
            console.log(i);
            for (var j = i; j <= Object.keys(videos).length; j++) {
                if (videos[Object.keys(videos)[j]].selected) {
                    source['src'] = '/' + Object.keys(videos)[j] + '.mp4';
                    console.log(j);
                    player['load']();
                    i = j + 1;
                    if (i > Object.keys(videos).length) {
                        send({ done: true });
                    }
                    break;
                }
            }
        };
        next();
    };
    var data = { callback: funct.toString(), args: { videos: videos } };
    send(data);
};
var play = function (video) {
    var player = document.getElementById('video');
    var source = document.getElementById('source');
};
//# sourceMappingURL=mainscreen.js.map