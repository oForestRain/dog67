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
        gravity : 2048,
        gStateType : {
            default:StateType.Landing,
            type:StateType,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
        this.speed = 0;
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
        this.stateType = this.gStateType;
        // console.log("Gravity--->onEnable",this.stateType);
    },
    
    onDisable: function () {

    },
     
    //gravity
    // ActorLanding: 20,
    // ActorFalling: 21,
        
    initListener : function(){
        this.node.on(EventType.ActorLanding, 
            function (event) {
                // console.log("Gravity--->",event.type);
                this.gLanding();
            },
            this);
            
        this.node.on(EventType.ActorFalling, 
            function (event) {
                // console.log("Gravity--->",event.type);
                this.gFallDown();
            },
            this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.stateType === StateType.Falling){
            // console.log("Gravity-->update",this.stateType);
            var endSpeed = this.speed - dt * this.gravity;
            var offsetY = (endSpeed + this.speed)/2 * dt;
            
            this.node.y += offsetY;
            this.speed = endSpeed;
        }
    },
    
    gLanding: function() {
        // console.log("gLanding-->",this.stateType);
        this.stateType = StateType.Landing;
        
        this.speed = 0;
    },
    
    gFallDown: function() {
        // console.log(this.stateType);
        this.stateType = StateType.Falling;
        
        this.speed = 0;
    },
    
});
