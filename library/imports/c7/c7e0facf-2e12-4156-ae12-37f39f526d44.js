var EventType = require("EventType");
var StateType = require("StateType");

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
        gravity: 2048
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.stateType = StateType.aLanding;

        this.initListener();
    },

    initListener: function initListener() {
        this.node.on(EventType.aLandingEvent, function (event) {
            // console.log(event.type);
            this.gLanding();
        }, this);

        this.node.on(EventType.aFallDownEvent, function (event) {
            // console.log(event.type);
            this.gFallDown();
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.stateType === StateType.aFallDown) {
            var endSpeed = this.speed - dt * this.gravity;
            var offsetY = (endSpeed + this.speed) / 2 * dt;

            this.node.y += offsetY;
            this.speed = endSpeed;
        }
    },

    gLanding: function gLanding() {
        // console.log(this.stateType);
        this.stateType = StateType.aLanding;

        this.speed = 0;
    },

    gFallDown: function gFallDown() {
        // console.log(this.stateType);
        this.stateType = StateType.aFallDown;

        this.speed = 0;
    }

});