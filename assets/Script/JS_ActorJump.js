var EventType = require("EventType");
var DirectionType = require("DirectionType");
var StateType = require("StateType");
// var Box2dWeb = require("Box2dWeb");
// var JS_Gravity = require("JS_Gravity");

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
        jHeight : 128,
        jHeight2 : 128,
    },

    // use this for initialization
    onLoad: function (dt) {
        this.GravityCom = this.getComponent("JS_Gravity");

        this.initListener();
    },
    
    // // StateType
    // Idle: 0,
    // //move
    // MoveLeft:1,
    // MoveRight:2,
    // MoveToStop:3,
    // //jump
    // Landing:4,
    // Jump:5,
    // Jump2:6,
    // Falling:7,
    
    onEnable: function () {
       this.stateType = StateType.Landing;
    },
    
    onDisable: function () {

    },
    
    //control
    // ActorMove: 0,
    // ActorMoveStop: 1,
    // ActorJump: 2,
    // ActorJumpStop: 3,
    //gravity
    // ActorLanding: 20,
    // ActorFalling: 21,
    
    initListener : function(){
        
        this.node.on(EventType.ActorJump, 
            function (event) {
                // console.log(event.type);
                this.mJump();
            },
            this);
            
        // this.node.on(EventType.aJumpStop, 
        //     function (event) {

        //     },
        //     this);

        this.node.on(EventType.ActorMotionLock, 
            function (event) {
                this.mVerticalLock(event);
            },
            this);
        
        // this.node.on(EventType.aJumpLock, 
        //     function (event) {
        //         this.mJumpLock();
        //     },
        //     this);
            
        this.node.on(EventType.ActorLanding, 
            function (event) {
                this.mLandState();
            },
            this);
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.GravityCom===null){
            return;
        }
        
        // console.log(this.stateType);
        
        if(this.GravityCom.stateType === StateType.Landing){
            return;
        }

        if(this.stateType === StateType.Jump || this.stateType === StateType.Jump2){
                var offsetY = this.speed * dt;
                
                this.node.y += offsetY;
        }
        
    },
    
    mJump: function() {

        if(this.GravityCom===null){
            return;
        }
        
        // console.log("ActorJump-->mJump",this.stateType);
        
        var jTime;
        var actorJHeight;
        var gravity;
        if(this.stateType === StateType.Landing){
            // this.startY = this.node.y;
            gravity = this.GravityCom.gravity;
            jTime = Math.sqrt(2*this.jHeight / gravity);
            this.speed = jTime * gravity;
            this.mJumpState();
        }
        else if(this.stateType === StateType.Jump){
            gravity = this.GravityCom.gravity;
            jTime = Math.sqrt(2*this.jHeight2 / gravity);
            this.speed = jTime * gravity;
            this.mJump2State();
        }

    },
    
    mFreeJump: function(){
        var event = new cc.Event.EventCustom(EventType.ActorMotionFree, true );
        var userData = {};
        userData.direction  = DirectionType.Down;
        event.setUserData(userData);
        this.node.dispatchEvent( event );
    },
    
    mVerticalLock: function(event) {
        if(this.GravityCom===null){
            return;
        }
        
        var userData = event.getUserData();
        var direction = userData.direction;
        var lock = userData.bool;
        // console.log("ActorJump-->mLockUp",direction,lock);
        if(!lock){
            return;
        }
        if(direction === DirectionType.Up){
            this.mJumpLock();
            this.speed =0;
        }
    },
    
    mJumpLock: function() {
        // console.log("ActorJump-->mJumpLock");
        if(this.GravityCom===null){
            return;
        }
        
        this.mJump2State();
    },
    
    mJumpState: function() {
        // console.log("ActorJump-->mJumpState");
        this.mFreeJump();
        
        this.stateType = StateType.Jump;

        var event = new cc.Event.EventCustom(EventType.ActorFalling, true );
        this.node.dispatchEvent( event );
    },
    
    mJump2State: function() {
        // console.log("mJumpState2-->");
        this.stateType = StateType.Jump2;
        
        var event = new cc.Event.EventCustom(EventType.ActorFalling, true );
        this.node.dispatchEvent( event );
    },

    mLandState: function() {
        // console.log("ActorJump-->mLandState");
        this.stateType = StateType.Landing;
        this.speed =0;
        
    },
});
