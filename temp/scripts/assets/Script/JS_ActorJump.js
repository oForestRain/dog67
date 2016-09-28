"use strict";
cc._RFpush(module, '43da5y26tVMs5fieNb+rIYl', 'JS_ActorJump');
// Script\JS_ActorJump.js

var EventType = require("EventType");
var StateType = require("StateType");
// var Box2dWeb = require("Box2dWeb");
// var JS_Gravity = require("JS_Gravity");

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
        jHeight: 128,
        jHeight2: 128
    },

    // use this for initialization
    onLoad: function onLoad(dt) {
        this.stateType = StateType.aLanding;
        this.GravityCom = this.getComponent("JS_Gravity");

        this.initListener();
    },

    initListener: function initListener() {

        this.node.on(EventType.aJumpEvent, function (event) {
            // console.log(event.type);
            this.mJump();
        }, this);

        // this.node.on(EventType.aJumpStopEvent,
        //     function (event) {

        //     },
        //     this);

        this.node.on(EventType.aUpLockEvent, function (event) {
            this.mStopUp();
        }, this);

        this.node.on(EventType.aJumpLockEvent, function (event) {
            this.mJumpLock();
        }, this);

        this.node.on(EventType.aLandingEvent, function (event) {
            this.mLandState();
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.GravityCom === null) {
            return;
        }

        // console.log(this.stateType);

        if (this.GravityCom.stateType === StateType.aLanding) {
            return;
        }

        if (this.stateType === StateType.aJump || this.stateType === StateType.aJump2) {
            var offsetY = this.speed * dt;

            this.node.y += offsetY;

            // this.node.y -= offsetY;
            // if(this.node.y + offsetY <= this.startY){
            //     this.node.y = this.startY;
            //     this.speed = 0;
            //     this.dispatchLanding();
            // }
            // else{
            //     this.node.y += offsetY;
            // }
        }
    },

    mJump: function mJump() {

        if (this.GravityCom === null) {
            return;
        }

        var jTime;
        var actorJHeight;
        var gravity;
        if (this.stateType === StateType.aLanding) {
            // this.startY = this.node.y;
            gravity = this.GravityCom.gravity;
            jTime = Math.sqrt(2 * this.jHeight / gravity);
            this.speed = jTime * gravity;
            this.mJumpState();
        } else if (this.stateType === StateType.aJump) {
            gravity = this.GravityCom.gravity;
            jTime = Math.sqrt(2 * this.jHeight2 / gravity);
            this.speed = jTime * gravity;
            this.mJump2State();
        }
    },

    mStopUp: function mStopUp() {

        if (this.GravityCom === null) {
            return;
        }

        this.mJumpLock();
        this.speed = 0;
    },

    mJumpLock: function mJumpLock() {

        if (this.GravityCom === null) {
            return;
        }

        this.mJump2State();
    },

    mJumpState: function mJumpState() {
        // console.log("mJumpState-->");
        this.stateType = StateType.aJump;

        var event = new cc.Event.EventCustom(EventType.aFallDownEvent, true);
        this.node.dispatchEvent(event);
    },

    mJump2State: function mJump2State() {
        // console.log("mJumpState2-->");
        this.stateType = StateType.aJump2;

        var event = new cc.Event.EventCustom(EventType.aFallDownEvent, true);
        this.node.dispatchEvent(event);
    },

    mLandState: function mLandState() {

        this.stateType = StateType.aLanding;
        this.speed = 0;
    }

});
// dispatchLanding: function() {

//     var event = new cc.Event.EventCustom(EventType.aLandingEvent, true );
//     this.node.dispatchEvent( event );

// },

cc._RFpop();