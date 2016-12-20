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
    btnResart : function(event,data){
        // console.log("UISceneOver--->btnResart",data);
        // var userData = {};
        event = new cc.Event.EventCustom(EventType.SceneRestart, true );
        // event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
    
    btnExit : function(event,data){
        // console.log("UISceneOver--->btnExit",data);
        // var userData = {};
        event = new cc.Event.EventCustom(EventType.SceneMapSelect, true );
        // event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
    
    btnResume : function(event,data){
        // console.log("UISceneOver--->btnResume",data);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.SceneShowUI, true );
        userData.interactUIType = InteractUIType.GameResume;
        event.setUserData(userData);
        this.node.dispatchEvent(event);
        
        event = new cc.Event.EventCustom(EventType.SceneResume, true );
        this.node.dispatchEvent(event);
    },
    
    btnNext : function(event,data){
        // console.log("UISceneOver--->btnNext",data);
        // var userData = {};
        event = new cc.Event.EventCustom(EventType.SceneNext, true );
        // event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
});
