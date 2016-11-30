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
        // actor : {
        //     default : null,
        //     type: cc.Node,
        // },
        playerParent : {
            default : null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.director.setDisplayStats(true);
        
        this.initListener();
        
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox.enabled = true; 
        cc.director.getCollisionManager().enabledDebugDraw = true;

    },
    
    initListener : function(){
        this.node.on(EventType.BrickPush, 
            function (event) { 
                this.brickPush(event);
            },
            this);
        this.node.on(EventType.ResourceCollect, 
            function (event) { 
                this.resCollect(event);
            },
            this);
    },
 
    onEnable: function () {
        GlobalReference.SceneMode = this.node;
        GlobalReference.InstanceFactory = this.node;
        GlobalReference.InputController = this.node;
        GlobalReference.CameraFollow = this.node;
        
        GlobalReference.PlayerInstance = this.actor;
        // console.log("SceneMode-->onEnable",GlobalReference.InstanceFactory);
    },
    
    onDisable: function () {
        var event = new cc.Event.EventCustom(EventType.InstancePlayerPut, true);
        var userData={};
        event.setUserData(userData);
        GlobalReference.InstanceFactory.dispatchEvent(event);
    },
    
    start: function () {
        // console.log("SceneMode-->start");
        var initData;
        this.initPlayerInstance(initData);
    },
    
    initPlayerInstance: function (initData) {
        // console.log("SceneMode--->initPlayerInstance");
        var event = new cc.Event.EventCustom(EventType.InstancePlayerGet, true);
        var userData={};
        userData.initData = initData;
        userData.parent = this.playerParent;
        
        userData.delegate = this;
        userData.callback = this.initScene;
        event.setUserData(userData);
        GlobalReference.InstanceFactory.dispatchEvent(event);
    },
    
    initScene: function (delegate,target) {
        // console.log("SceneMode--->initScene",target);
        if(target===undefined){
            return;
        }
        GlobalReference.PlayerInstance = target;
        delegate.setInputControllerTarget(target);
        delegate.setCameraFollowTarget(target);
        console.log("SceneMode--->initScene");
    },
    
    setInputControllerTarget: function (target) {
        // console.log("SceneMode--->setInputControllerTarget",target);
        var event = new cc.Event.EventCustom(EventType.InputControllerTarget, true);
        var userData={};
        userData.target = GlobalReference.PlayerInstance;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
    },
    
    setCameraFollowTarget: function (target) {
        // console.log("SceneMode--->setCameraFollowTarget",target);
        var event = new cc.Event.EventCustom(EventType.CameraFollowTarget, true);
        var userData={};
        userData.target = GlobalReference.PlayerInstance;
        event.setUserData(userData);
        GlobalReference.SceneMode.dispatchEvent(event);
    },
    
    brickPush: function (event) {
        var userData = event.getUserData();
        var actor = userData.actor;
        var target = userData.other;
        
    },
    
    resCollect: function (event) {
        var userData = event.getUserData();
        var actor = userData.actor;
        var target = userData.other;
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});