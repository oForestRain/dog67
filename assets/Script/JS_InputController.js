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
        actor: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {

        this.initListener();
        
        // this.debuglog = this.getComponent(cc.Label);
        
    },
    
    onEnable: function () {

    },
    
    onDisable: function () {

    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // this.debuglog.string = this.moveDeriction;
    },
    
    initListener : function(){
        //add keyboard input listener to call turnLeft and turnRight
        var self = this;
        
        var listener = {
            event: cc.EventListener.KEYBOARD, 
            onKeyPressed: function(keyCode, event) {
                if(keyCode == cc.KEY.a || keyCode == cc.KEY.left){
                    self.mLeft();
                }
                else if(keyCode == cc.KEY.d || keyCode == cc.KEY.right){
                    self.mRight();
                }
                else if(keyCode == cc.KEY.j){
                    self.mJump();
                }
            },
            onKeyReleased: function(keyCode, event) {
                if(keyCode == cc.KEY.a || keyCode == cc.KEY.left){
                    self.mLeftStop();
                }
                else if(keyCode == cc.KEY.d || keyCode == cc.KEY.right){
                    self.mRightStop();
                }
                else if(keyCode == cc.KEY.j){
                    self.mJumpStop();
                }
            },
        }
        
        
        cc.eventManager.addListener(listener, self.node);
    },
    
    //control
    // ActorMove: 0,
    // ActorMoveStop: 1,
    // ActorJump: 2,
    // ActorJumpStop: 3,
    
    mLeft: function() {
        var event = new cc.Event.EventCustom(EventType.ActorMove, true );
        var userData = {};
        userData.direction = DirectionType.Left;
        event.setUserData(userData);

        // console.log(event.type,userData.direction);
        
        this.actor.dispatchEvent( event );
    },

    mRight: function() {
        var event = new cc.Event.EventCustom(EventType.ActorMove, true );
        var userData = {};
        userData.direction = DirectionType.Right;
        event.setUserData(userData);
        
        // console.log(event.type,userData.direction);
        
        this.actor.dispatchEvent( event );
    },
    
    mJump: function() {
        var event = new cc.Event.EventCustom(EventType.ActorJump, true );
        
        // console.log(event.type);
        
        this.actor.dispatchEvent( event );
    },
    
    mLeftStop: function() {
        var event = new cc.Event.EventCustom(EventType.ActorMoveStop, true );
        var userData = {};
        userData.direction = DirectionType.Left;
        event.setUserData(userData);
        
        // console.log(event.type,userData.direction);
        
        this.actor.dispatchEvent( event );
    },
    
    mRightStop: function() {
        var event = new cc.Event.EventCustom(EventType.ActorMoveStop, true );
        var userData = {};
        userData.direction = DirectionType.Right;
        event.setUserData(userData);
        
        // console.log(event.type,userData.direction);
        
        this.actor.dispatchEvent( event );
    },
    
    mJumpStop: function() {
        var event = new cc.Event.EventCustom(EventType.ActorJumpStop, true );
        
        // console.log(event.type);
        
        this.actor.dispatchEvent( event );
    },

});
