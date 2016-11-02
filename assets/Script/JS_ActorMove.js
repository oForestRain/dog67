var EventType = require("EventType");
var StateType = require("StateType");

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
        maxSpeed : 400,
        initialSpeed:100,
        accelerate : 300,
        dragAccelerate : 800,
    },

    // use this for initialization
    onLoad: function () {

        
        this.initListener();
        
    },
    
    onEnable: function () {
        this.leftLock = false;
        this.rightLock = false;
        this.speed = 0;
    },
    
    onDisable: function () {

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var offsetSpeed;
        if(this.stateType === StateType.aMovingRight){
            if(this.rightLock === true){
                this.speed = 0;
            }
            else{
                if(this.speed < this.initialSpeed){
                    this.speed = this.initialSpeed;
                }
                offsetSpeed = parseInt(this.accelerate*dt);
                this.speed += offsetSpeed;
                if(this.speed > this.maxSpeed){
                    this.speed = this.maxSpeed;
                }
            }
        }
        else if(this.stateType === StateType.aMovingLeft){
            if(this.leftLock === true){
                this.speed = 0;
            }
            else{
                if(this.speed > -this.initialSpeed){
                    this.speed = -this.initialSpeed;
                }
                offsetSpeed = parseInt(this.accelerate*dt);
                this.speed -= offsetSpeed;
                if(this.speed < -this.maxSpeed){
                    this.speed = -this.maxSpeed;
                }
            }
        }

        if(this.stateType === StateType.aMoveToStop){
            var dragSpeed = parseInt(this.dragAccelerate*dt);
            if(this.speed > 0 ){
                this.speed -= dragSpeed;
            }
            else if(this.speed < 0 ){
                this.speed += dragSpeed;
            }
        }

        if(this.speed === 0){
            if(this.stateType === StateType.aMoveToStop){
                this.mIdleState();
            }
        }
        
        // console.log(this.stateType,this.speed," : ",this.maxSpeed);
        this.node.x +=this.speed*dt;
    },
    
    initListener : function(){
        this.node.on(EventType.aMove, 
            function (event) {
                //console.log(event.type);
                this.aMove(event);
            },
            this);

        this.node.on(EventType.aStop, 
            function (event) {
                //console.log(event.type);
                this.aStop(event);
            },
            this);
 
         this.node.on(EventType.aLock, 
            function (event) {
                //console.log(event.type);
                this.aLock(event);
            },
            this);
    },

    aMove: function(event) {
        var userData = event.getUserData();
        var direction = userData.direction;

        switch(direction) {
            case EventType.dLeft:
                this.mMovingLeftState();
                break;
            case EventType.dRight:
                this.mMovingRightState();
                break;
        }
    },

    // aIdle: "ActorIdle",
    // aMovingLeft: "ActorMovingLeft",
    // aMovingRight: "ActorMovingRight",
    // aMoveToStop: "ActorMoveToStop",
    
    mMovingLeftState: function() {
        this.stateType = StateType.aMovingLeft;
        
        this.node.scaleX = -1;
    },
    
    mMovingRightState: function() {
        this.stateType = StateType.aMovingRight;
        
        this.node.scaleX = 1;
    },
    
    aStop: function(event) {
        var userData = event.getUserData();
        var direction = userData.direction;

        switch(direction) {
            case EventType.dLeft:
                if(this.speed < 0 ){
                    this.mMoveToStopState();
                }
                break;
            case EventType.dRight:
                if(this.speed > 0 ){
                    this.mMoveToStopState();
                }
                break;
        }
    },

    mMoveToStopState: function() {
        
        this.stateType = StateType.aMoveToStop;

    },
    
    mIdleState: function() {
        
        this.stateType = StateType.aIdle;

    },
    
    aLock: function(event) {
        var userData = event.getUserData();
        var direction = userData.direction;
        var lock = userData.bool;
        
        // console.log("ActorMove--->",direction,lock);
        
        switch(direction) {
            case EventType.dLeft:
                this.leftLock = lock;
                break;
            case EventType.dRight:
                this.rightLock = lock;
                break;
        }
    },
});
