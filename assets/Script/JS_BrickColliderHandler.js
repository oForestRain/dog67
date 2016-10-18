var GlobalReference = require("GlobalReference");
var EventType = require("EventType");
var PrefabType = require("PrefabType");

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
        type: {
            default:PrefabType.brickSmash,
            type:PrefabType,
        },

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
        
        // console.log("enterHandler-->");
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

        var event = new cc.Event.EventCustom(EventType.insFacChange , true);
        
        var userData = {};
        userData.target = this.node;
        userData.prefabType = this.type;
        event.setUserData(userData);
        
        console.log("pushed--->",userData.target,userData.prefabType);
        
        GlobalReference.InstanceFactory.dispatchEvent(event);
    },
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    
    // },
});
