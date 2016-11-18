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
        actor : {
            default: null,
            type: cc.Node,
        },
        followers : {
            default: [],
            type: [cc.Node],
        },
        scales : {
            default: [],
            type: [cc.Vec2],
        },
        activeOnEnable:true,
    },

    // use this for initialization
    onLoad: function () {
         this.initListener();

    },
    
    onEnable: function () {
        this.enable = this.activeOnEnable;

        this.setActorTarget(GlobalReference.PlayerInstance);
        if(this.actor){
            this.setActorTarget(this.actor);
        }
    },
    
    onDisable: function () {

    },
    
    initListener: function(){
        this.node.on(EventType.CameraFollowEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
        this.node.on(EventType.CameraFollowTarget, 
            function (event) {
                this.cameraFollowTarget(event);
            },
            this);
    },
    
    cameraFollowTarget : function( event ){
        var userData = event.getUserData();
        var target = userData.target;
        
        this.setActorTarget(target);
    },

    componentEnable : function( event ){
        var userData = event.getUserData();
        this.enable = userData.enable;
        
        if(this.target){
            this.targetPos = this.target.position;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // console.log("CameraFollow--->update");
        if( this.enable!==true){
            return;
        }
        if(this.targetPos.equals(this.target.position)){
            return;
        }
        var offset = this.targetPos.sub(this.target.position);
        this.moveFollowers(offset);
        this.targetPos = this.target.position;
    },
    
    setActorTarget : function(target){
        this.target = target;
        
        if(this.enable){
            this.targetPos = this.target.position;
        }
    },

    moveFollowers: function(offset){
        var follower;
        var scale;
        for(var key in this.followers){
            follower = this.followers[key];
            scale = this.scales[key];
            if(scale === undefined){
                scale = new Vec2(1,1);
            }
            follower.position = follower.position.add(offset.scale(scale));
        }
        this.target.position = this.target.position.add(offset);
    }

});
