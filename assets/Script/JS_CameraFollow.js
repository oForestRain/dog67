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
        pos: new cc.Vec2(-100, 0),
        size: new cc.Vec2(3500, 1280),
    },

    // use this for initialization
    onLoad: function () {

    },

    onEnable: function () {
        this.following = false;
        this.follow;
        
        this.setFollowTarget(GlobalReference.PlayerInstance);
        this.followTarget();
    },
    
    onDisable: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    setFollowTarget : function(target){
        this.target = target;
    },
    
    followTarget:function(){
        if(this.target===undefined){
            return;
        }
        this.follow = cc.follow(this.target, 
                                cc.rect(this.pos.x,this.pos.y,
                                            this.size.x,this.size.y));
        this.target.parent.runAction(this.follow);
        this.following = true;
        // console.log("CameraFollow.followTarget--->",this.target,this.follow);
    },
    
    stopFollow:function(){
        this.node.stopAction(this.follow);
    },

});
