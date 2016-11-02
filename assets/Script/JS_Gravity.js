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
        gEnable : true,
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();
    },
    
    onEnable: function () {
        this.stateType = StateType.aLanding;
    },
    
    onDisable: function () {

    },
     

    initListener : function(){
        this.node.on(EventType.aLanding, 
            function (event) {
                // console.log("Gravity--->",event.type);
                this.gLanding();
            },
            this);
            
        this.node.on(EventType.aFallDown, 
            function (event) {
                // console.log("Gravity--->",event.type);
                this.gFallDown();
            },
            this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(!this.gEnable){
            return;
        }
        
        if(this.stateType === StateType.aFallDown){
            var endSpeed = this.speed - dt * this.gravity;
            var offsetY = (endSpeed + this.speed)/2 * dt;
            
            this.node.y += offsetY;
            this.speed = endSpeed;
        }
    },
    
    gLanding: function() {
         // console.log(this.stateType);
        this.stateType = StateType.aLanding;
        
        this.speed = 0;
    },
    
    gFallDown: function() {
        // console.log(this.stateType);
        this.stateType = StateType.aFallDown;
        
        this.speed = 0;
    },
    
});
