var EventType = require("EventType");
var SceneType  = require("SceneType");
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
        this.node.on(EventType.SceneSelect, 
            function (event) { 
                this.sceneSelect(event);
            },
            this);
        this.node.on(EventType.SceneRestart, 
            function (event) { 
                this.sceneRestart(event);
            },
            this);
        this.node.on(EventType.SceneNext, 
            function (event) { 
                this.sceneNext(event);
            },
            this);
        this.node.on(EventType.SceneMapSelect, 
            function (event) { 
                this.sceneMapSelect(event);
            },
            this);
    },
    
    onEnable: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    sceneSelect:function(event){
        // console.log("SceneSelect--->selectScene",GlobalReference.SceneManager);
        var userData = event.getUserData();
        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        event.setUserData(userData);
        GlobalReference.SceneManager.dispatchEvent(event);
    },
    
    sceneRestart: function (event) {
        // console.log("SceneSelect--->sceneRestart",GlobalReference.SceneManager);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        userData.sceneName = cc.director.getScene().name;
        event.setUserData(userData);
        GlobalReference.SceneManager.dispatchEvent(event);
    },
    
    sceneNext: function (event) {
        // console.log("SceneSelect--->sceneNext",GlobalReference.NextScene,GlobalReference.SceneManager);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        userData.sceneName = GlobalReference.NextScene;
        event.setUserData(userData);
        GlobalReference.SceneManager.dispatchEvent(event);
    },
    
    sceneMapSelect: function (event) {
        // console.log("SceneSelect--->sceneMapSelect",SceneType.Select);
        var userData = {};
        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        userData.sceneEnum = SceneType.Select;
        event.setUserData(userData);
        GlobalReference.SceneManager.dispatchEvent(event);
    },
});
