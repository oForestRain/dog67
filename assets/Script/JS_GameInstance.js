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

        controller : {
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
        this.initListener();
    },
    
    initListener : function(){
        this.node.on(EventType.brickPush, 
            function (event) { 
                this.brickPush(event);
            },
            this);
        this.node.on(EventType.resCollect, 
            function (event) { 
                this.resCollect(event);
            },
            this);
    },
    
    start: function () {
        GlobalReference.GameInstance = this.node;
        GlobalReference.GameController  = this.controller;
        GlobalReference.InstanceFactory  = this.insFactory;
        
        cc.director.setDisplayStats(true);
        
        cc.game.addPersistRootNode(this.node);
        // removePersistRootNode
        //  console.log("JS_GameInstance.isPersistRootNode--->",cc.game.isPersistRootNode(this.node));
    },
    
    brickPush: function (event) {
        var userData = event.getUserData();
        var target = userData.target;
        var targetType = userData.type;
        var pool = userData.pool;
        var changePrefabType = userData.changePrefabType;
        var addPrefabType = userData.addPrefabType;
        var position = userData.target.position;
        
        // console.log("GameInstance.brickPush--->",userData);
        if(addPrefabType!=PrefabType.pnull){
            event = new cc.Event.EventCustom(EventType.insFacAdd, true);
            userData = {};
            userData.target = target;
            userData.prefabType = addPrefabType;
            userData.position = position;
            event.setUserData(userData);
            GlobalReference.InstanceFactory.dispatchEvent(event);
        }
        
        if(changePrefabType!=PrefabType.pnull){
            event = new cc.Event.EventCustom(EventType.insFacChange, true);
            userData = {};
            userData.target = target;
            userData.type = targetType;
            userData.pool = pool;
            userData.prefabType = changePrefabType;
            event.setUserData(userData);
            GlobalReference.InstanceFactory.dispatchEvent(event);
        }
       
    },
    
    resCollect: function (event) {
        console.log("resCollect--->");
        var userData = event.getUserData();
        var target = userData.target;
        var targetType = userData.type;
        var pool = userData.pool;

        event = new cc.Event.EventCustom(EventType.insFacDel, true);
        userData = {};
        userData.target = target;
        userData.type = targetType;
        userData.pool = pool;
        event.setUserData(userData);
        GlobalReference.InstanceFactory.dispatchEvent(event);
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
