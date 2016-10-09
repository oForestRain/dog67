var EventType = require("EventType");
var PrefabType = require("PrefabType");
var JS_PrefabPool = require("JS_PrefabPool");

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
        
        prefabPoolNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        this.initListener();
        
        this.prefabPool = this.prefabPoolNode.getComponent("JS_PrefabPool");

    },
    
    initListener : function(){
        this.node.on(EventType.aConlliderEnter, 
            function (event) { 
                this.enterHandler(event);
            },
            this);
      },
    
    enterHandler : function( event ){
        var userData = event.getUserData();
        // console.log("enterHandler-->",userData.other.node.group);

        // if(userData === null || userData.other === null || userData.other.node === null){
            // return;
        // }

        switch(userData.other.node.group){
            case EventType.Enemy:
                this.enterEnemy(userData);
                break;
            case EventType.Player:
                this.enterPlayer(userData);
                break;
        }
        
        console.log("enterHandler-->");
    },
    
    enterEnemy : function( userData ){
        
    },

    enterPlayer : function( userData ){
        // if(userData === null){
        //     return;
        // }
        
        this.enterPlayerCheckBorder(userData);
        
        // console.log("enterTerrainCheckBorder-->",this.leftLockCount,this.rightLockCount,this.landingLockCount);
    },
    
    enterPlayerCheckBorder : function(userData){
        var part = userData.part;

        var otherPreAabb = userData.other.world.preAabb;
        var selfPreAabb = userData.actor.world.preAabb;
        var otherAabb = userData.other.world.aabb;
        var selfAabb = userData.actor.world.aabb;

        // console.log("enterPlayerCheckBorder-->",part);
        
        switch(part){
            case EventType.cPartBottom:
            case EventType.cPartBottomLeft:
            case EventType.cPartBottomRight:
                this.pushed();
                break;
        }
    },
    
    pushed: function (dt) {
        // console.log(this.prefabPool);
        // console.log(PrefabType.brickSmash);

        var particle = this.prefabPool.getPrefab(PrefabType.brickSmash);
        particle.position =  this.node.position;
        particle.parent = this.node.parent;

        this.node.destroy();
        
        // var event = new cc.Event.EventCustom(EventType.brickSmash, true);
        // this.node.dispatchEvent(event);
    },
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    
    // },
});
