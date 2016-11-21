var EventType = require("EventType");
var PrefabType = require("PrefabType");
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
        loadingScene: "Loading",
        LoadingUI : {
            default: null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.director.setDisplayStats(true);
        
        this.initListener();
        
        GlobalReference.GameInstance = this.node;
        // GlobalReference.Loading = this.LoadingUI;
       
        console.log("GameInstance--->onLoad GameInstance",GlobalReference.GameInstance);
        // console.log("GameInstance--->onLoad Loading",GlobalReference.Loading);
                        // GlobalReference.GameInstance,
                        // GlobalReference.InputController,
                        // GlobalReference.InstanceFactory);
    },
    
    initListener : function(){
        this.node.on(EventType.GameLoadingScene, 
            function (event) {
                this.gameLoadingScene(event);
            },
            this);
        this.node.on(EventType.LoadingUIComplete,
            function (event) {
                this.loadingUIComplete(event);
            },
            this);
         this.node.on(EventType.SceneLoadingComplete,
            function (event) {
                this.sceneLoadingComplete(event);
            },
            this);
        this.node.on(EventType.SceneEnterComplete,
            function (event) {
                this.sceneEnterComplete(event);
            },
            this);
    },
    
    start: function () {
        cc.game.addPersistRootNode(this.node);
        // removePersistRootNode
        // console.log("GameInstance.isPersistRootNode--->",cc.game.isPersistRootNode(this.node));
        // console.log("GameInstance--->start",GlobalReference.PlayerInstance);
    },
    
    onEnable: function () {

        // console.log("GameInstance--->onEnable",GlobalReference.PlayerInstance);
    },
    
    onDisable: function () {

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    gameLoadingScene:function(event){
        var userData = event.getUserData();
        cc.director.loadScene(this.loadingScene);
        this.nextSceneName = userData.sceneName;
        console.log("GameInstance--->gameLoadingScene",this.nextSceneName);
    },
    
    loadingUIComplete:function(event){
        event = new cc.Event.EventCustom(EventType.LoadingScene, true );
        var userData={};
        userData.sceneName = this.nextSceneName;
        console.log("GameInstance--->loadingUIComplete",userData.sceneName);
        event.setUserData(userData);
        GlobalReference.Loading.dispatchEvent(event);
    },

    sceneLoadingComplete: function (event) {
        console.log("GameInstance--->sceneLoadingComplete");
        var userData = event.getUserData();
        console.log("GameInstance--->sceneLoadingComplete",userData.sceneName);
        event = new cc.Event.EventCustom(EventType.EnterScene, true );
        event.setUserData(userData);
        GlobalReference.Loading.dispatchEvent( event );
    },
    
    sceneEnterComplete: function (event) {
        var userData = event.getUserData();
        console.log("GameInstance--->sceneEnterComplete",userData.sceneName);
        
    },
});