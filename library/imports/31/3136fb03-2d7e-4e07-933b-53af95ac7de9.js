var EventType = require("EventType");

cc.Class({
    "extends": cc.Component,

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
            "default": null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.initListener();

        // this.debuglog = this.getComponent(cc.Label);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        // this.debuglog.string = this.moveDeriction;
    },

    initListener: function initListener() {
        //add keyboard input listener to call turnLeft and turnRight
        var self = this;

        var listener = {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.mLeft();
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.mRight();
                        break;
                    case cc.KEY.j:
                        self.mJump();
                        break;
                }
            },
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.mLeftStop();
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.mRightStop();
                        break;
                    case cc.KEY.j:
                        self.mFalldown();
                        break;
                }
            }
        };

        cc.eventManager.addListener(listener, self.node);
    },

    mLeft: function mLeft() {
        var event = new cc.Event.EventCustom(EventType.aLeftEvent, true);

        // console.log(event.type);

        this.actor.dispatchEvent(event);
    },

    mRight: function mRight() {
        var event = new cc.Event.EventCustom(EventType.aRightEvent, true);
        // event.setUserData({a:1});
        // console.log(event.type);

        this.actor.dispatchEvent(event);
    },

    mJump: function mJump() {
        var event = new cc.Event.EventCustom(EventType.aJumpEvent, true);

        // console.log(event.type);

        this.actor.dispatchEvent(event);
    },

    mLeftStop: function mLeftStop() {
        var event = new cc.Event.EventCustom(EventType.aLeftStopEvent, true);

        // console.log(event.type);

        this.actor.dispatchEvent(event);
    },

    mRightStop: function mRightStop() {
        var event = new cc.Event.EventCustom(EventType.aRightStopEvent, true);

        // console.log(event.type);

        this.actor.dispatchEvent(event);
    },

    mFalldown: function mFalldown() {
        var event = new cc.Event.EventCustom(EventType.aJumpStopEvent, true);

        // console.log(event.type);

        this.actor.dispatchEvent(event);
    }

});