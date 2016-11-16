var EventType = require("EventType");
var DirectionType = require("DirectionType");

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
        speed : 65,
        moveOnEnable : true,
    },
    
    onLoad: function () {
        this.startMove = false;
        
        this.initListener();
    },
    
    onEnable: function () {
        this.startMove = this.moveOnEnable;
        this.moveStep = -this.speed;
    },
    
    onDisable: function () {

    },

    initListener : function(){
         this.node.on(EventType.ActorMotionLock, 
            function (event) {
                this.goBackTo(event);
            },
            this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.startMove){
            // console.log("EnemyAutoMove--->update",dt,cc.p(dt*this.moveStep,0));
            // var action = cc.moveBy(dt, cc.p(dt*this.moveStep,0));
            // this.node.runAction(action);
            this.node.x +=dt*this.moveStep;
        }
    },
    
    goBackTo: function(event) {
        var userData = event.getUserData();
        var direction = userData.direction;
        var lock = userData.bool;
        
        // console.log("EnemyAutoMove--->goBackTo",direction,lock);
        if(!lock){
            return;
        }
        
        if(direction==DirectionType.Left) {
            this.moveStep = this.speed;
        }
        else if(direction==DirectionType.Right){
            this.moveStep = -this.speed;
        }
    },
});
