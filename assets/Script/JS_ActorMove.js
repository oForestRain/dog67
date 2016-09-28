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

        this.leftLock = false;
        this.rightLock = false;
        this.speed = 0;
        this.initListener();
        
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
        this.node.on(EventType.aLeftEvent, 
            function (event) {
                //console.log(event.type);
                this.mLeft();
            },
            this);
            
        this.node.on(EventType.aRightEvent, 
            function (event) {
                // console.log(event.type,event.getUserData());
                this.mRight();
            },
            this);

        this.node.on(EventType.aLeftStopEvent, 
            function (event) {
                //console.log(event.type);
                this.mMoveLeftToStopState();
            },
            this);
            
        this.node.on(EventType.aRightStopEvent, 
            function (event) {
                //console.log(event.type);
                this.mMoveRightToStopState();
            },
            this);
        this.node.on(EventType.aMLeftLockEvent, 
            function (event) {
                //console.log(event.type);
                this.mLeftLock(event);
            },
            this);
        this.node.on(EventType.aMRightLockEvent, 
            function (event) {
                //console.log(event.type);
                this.mRightLock(event);
            },
            this);
    },

    mLeft: function() {

        this.mMovingLeftState();
        
    },

    mRight: function() {

        this.mMovingRightState();
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
    
    mMoveLeftToStopState: function() {
        
        if(this.stateType === StateType.aMovingLeft){
            this.mMoveToStopState();
        }

    },
    
    mMoveRightToStopState: function() {
        
        if(this.stateType === StateType.aMovingRight){
             this.mMoveToStopState();
        }

    },
    
    mMoveToStopState: function() {
        
        this.stateType = StateType.aMoveToStop;

    },
    
    mIdleState: function() {
        
        this.stateType = StateType.aIdle;

    },
    
    mLeftLock: function(event) {
        var userData = event.getUserData();

        this.leftLock = userData.bool;
        // console.log("mLeftLock--->"+this.leftLock);
    },
    
    mRightLock: function(event) {
        var userData = event.getUserData();

        this.rightLock = userData.bool;
        // console.log("mLeftLock--->"+this.rightLock);
    },

});
