var EventType = require("EventType");

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
        this.node.destroy();
    },
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    
    // },
});
