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
    
    btnPause : function(event,data){
        // console.log("UISceneState--->btnPause",data);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.SceneShowUI, true );
        userData.interactUIType = InteractUIType.GamePause;
        event.setUserData(userData);
        this.node.dispatchEvent(event);
        
         event = new cc.Event.EventCustom(EventType.ScenePause, true );
        // event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
});
