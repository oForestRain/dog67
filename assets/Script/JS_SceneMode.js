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
        actor : {
            default: null,
            type: cc.Node,
        },
        
        mainCamera : {
            default: null,
            type: cc.Node
        },

        inpController : {
            default: null,
            type: cc.Node
        },
        
        insFactory : {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.director.setDisplayStats(true);
        
        this.initListener();
        
        GlobalReference.PlayerInstance = this.actor;
        GlobalReference.MapMode = this.node;
        GlobalReference.InputController  = this.inpController;
        GlobalReference.InstanceFactory  = this.insFactory;
        GlobalReference.MainCamera  = this.mainCamera;
        
        // console.log("GameInstance--->onLoad",GlobalReference.PlayerInstance,
        //                 GlobalReference.GameInstance,
        //                 GlobalReference.InputController,
        //                 GlobalReference.InstanceFactory);
        
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox.enabled = true; 
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
    
    start: function () {

        cc.director.setDisplayStats(true);
        
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
    
    startGame: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox.enabled = true; 
        cc.director.getCollisionManager().enabledDebugDraw = true;
        
        // removePersistRootNode
        // console.log("GameInstance.isPersistRootNode--->",cc.game.isPersistRootNode(this.node));
        // console.log("GameInstance--->start",GlobalReference.PlayerInstance);
    },
    
    endGame: function () {
        cc.director.getCollisionManager().enabled = false;

        // removePersistRootNode
        // console.log("GameInstance.isPersistRootNode--->",cc.game.isPersistRootNode(this.node));
        // console.log("GameInstance--->start",GlobalReference.PlayerInstance);
    },
    
    restartGame: function(){
        cc.director.loadScene("MapSelect");
    },

    returnMenu: function(){
        cc.director.loadScene("Start");
    },
});