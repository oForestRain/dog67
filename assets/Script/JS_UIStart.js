var EventType = require("EventType");
var InteractUIType = require("InteractUIType");

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
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    btnStart : function(event,data){
        // console.log("UIStart--->btnStart",data);
        event = new cc.Event.EventCustom(EventType.SceneSelect, true );
        var userData = {};
        userData.sceneName = data;
        event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
});
