"use strict";
cc._RF.push(module, 'ad7edagkKVPrq864CUgNTNE', 'GameController');
// GameController.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        "Tool 1": cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {},

    buttonClick: function buttonClick() {
        console.log("ewrqqwefsadfnasdof");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();