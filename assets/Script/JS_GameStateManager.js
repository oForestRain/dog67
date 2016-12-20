var EventType = require("EventType");
var GameStateType = require("GameStateType");
var UIType = require("UIType");
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
        this.node.on(EventType.GameState,
            function (event) {
                this.gameState(event);
            },
            this);
    },
    
     onEnable: function () {
        GlobalReference.GameStateManager = this.node;
        
        // console.log("GameStateManager--->onEnable");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    gameState : function (event) {
        var userData = event.getUserData();
        var type = userData.type;
        // console.log("GameStateManager-->gameState",type);
        
        if(type == GameStateType.Pause){
            this.pauseGame();
        }
        else if(type == GameStateType.Resume){
            this.resumeGame();
        }
    },
    
    pauseGame : function () {
        // console.log("GameStateManager-->pauseGame");
        if(cc.game.isPaused()===true){
            return;
        }
        
        this.enableInput(false);
        cc.game.pause();
    },

    resumeGame : function () {
        // console.log("GameStateManager-->resumeGame");
        if(cc.game.isPaused()===false){
            return;
        }
        
        this.enableInput(true);
        cc.game.resume();
    },
    
    enableInput : function (enable) {
        var event = new cc.Event.EventCustom(EventType.InputControllerEnable, true );
        var userData = {};
        userData.enable = enable;
        event.setUserData(userData);
        GlobalReference.InputController.dispatchEvent(event);
    },
});
