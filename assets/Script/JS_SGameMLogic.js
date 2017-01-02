var EventType = require("EventType");
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
    },
    
    onDisable: function () {
    },
    
    start: function () {
    },    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },

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
});