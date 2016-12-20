var EventType = require("EventType");
var GameStateType = require("GameStateType");
var GlobalReference = require("GlobalReference");

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
        
        this.initListener();
    },
    
    initListener : function(){
        this.node.on(EventType.ScenePause, 
            function (event) { 
                this.pauseGame(event);
            },
            this);
        this.node.on(EventType.SceneResume, 
            function (event) { 
                this.resumeGame(event);
            },
            this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    pauseGame : function (event) {
        // console.log("ScenePause-->pauseGame");
        var userData={};
        event = new cc.Event.EventCustom(EventType.GameState, true );
        userData.type = GameStateType.Pause;
        event.setUserData(userData);
        GlobalReference.GameStateManager.dispatchEvent(event);
    },

    resumeGame : function (event) {
        // console.log("ScenePause-->resumeGame");
        var userData={};
        event = new cc.Event.EventCustom(EventType.GameState, true );
        userData.type = GameStateType.Resume;
        event.setUserData(userData);
        GlobalReference.GameStateManager.dispatchEvent(event);
    },
});
