var EventType = require("EventType");

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
        // ...rightOffsetRate 
        leftOffsetRate : .3,
        rightOffsetRate : .3,
        topOffsetRate : .3,
        bottomOffsetRate : .3,
        onDisableCollisionManagerEnabled : false,
    },

    // use this for initialization
    onLoad: function () {
        
        this.initListener();

    },
    
    initListener: function(){
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },
    
    onDisable: function () {
        if(this.onDisableCollisionManagerEnabled){
            cc.director.getCollisionManager().enabled = false;
            cc.director.getCollisionManager().enabledDebugDraw = false;
        }
    },
    
    onCollisionEnter: function (other, self) {
        // console.log("onCollisionEnter");
        // this.node.color = cc.Color.RED;
        
        //conllider
        // aConlliderEnter : "ActorConlliderEnter",
        // aConlliderStay : "ActorConlliderStay",
        // aConlliderExit : "ActorConlliderExit",
        
        var event = new cc.Event.EventCustom(EventType.aConlliderEnter, true);
        var userData = {};
        userData.other = other;
        userData.actor = self;
        
        var otherAabb = other.world.aabb;
        var selfAabb = self.world.aabb;
        var otherPreAabb = other.world.preAabb;
        var selfPreCAabb = self.world.preAabb;
        
        // check part 
        userData.part = this.checkPart(otherAabb,selfAabb,otherPreAabb,selfPreCAabb);

        event.setUserData(userData);
        this.node.dispatchEvent(event);
    },

    checkPart: function(otherAabb,selfAabb,otherPreAabb,selfPreCAabb){
        
        var otherCenter = otherAabb.center;
        var selfCenter = selfAabb.center;
        
        var otherPreCenter = otherPreAabb.center;
        var selfPreCenter = selfPreCAabb.center;
        
        var leftBorder = selfCenter.x-selfAabb.width*this.leftOffsetRate*.5;
        var rightBorder = selfCenter.x+selfAabb.width*this.rightOffsetRate*.5;
        var topBorder = selfCenter.y+selfAabb.height*this.topOffsetRate*.5;
        var bottomBorder = selfCenter.y-selfAabb.height*this.bottomOffsetRate*.5;
        
        var part;
        
        //check x-axis
        var otherPreAabbClone = otherPreAabb.clone();
        var selfPreAabbClone = selfPreCAabb.clone();
        otherPreAabbClone.x = otherAabb.x;
        selfPreAabbClone.x = selfAabb.x;
        if (cc.Intersection.rectRect(selfPreAabbClone,otherPreAabbClone)) {
            //left be hit
            if (selfPreCenter.x > selfCenter.x || otherPreCenter.x < otherCenter.x) {
                // console.log("checkPart-->left be hit");
                if(otherAabb.yMin >= topBorder){
                    part = EventType.cPartLeftTop;
                }
                else if(otherAabb.yMax <= bottomBorder){
                    part = EventType.cPartLeftBottom;
                }
                else{
                    part = EventType.cPartLeft;
                }
            }
            //right be hit
            else if (selfPreCenter.x < selfCenter.x || otherPreCenter.x > otherCenter.x) {
                // console.log("checkPart-->right be hit");
                if(otherAabb.yMin >= topBorder){
                    part = EventType.cPartRightTop;
                }
                else if(otherAabb.yMax <= bottomBorder){
                    part = EventType.cPartRightBottom;
                }
                else{
                    part = EventType.cPartRight;
                }
            }
        }
        
        //check y-axis
        otherPreAabbClone = otherPreAabb.clone();
        selfPreAabbClone = selfPreCAabb.clone();
        otherPreAabbClone.y = otherAabb.y;
        selfPreAabbClone.y = selfAabb.y;
        if (cc.Intersection.rectRect(selfPreAabbClone,otherPreAabbClone)) {
            //top be hit
            if (selfPreCenter.y < selfCenter.y || otherPreCenter.y > otherCenter.y) {
                // console.log("checkPart-->top be hit");
                if(otherAabb.xMax <= leftBorder){
                    part = EventType.cPartTopLeft;
                }
                else if(otherAabb.xMin >= rightBorder){
                    part = EventType.cPartTopRight;
                }
                else{
                    part = EventType.cPartTop;
                }
            }
            //bottom be hit
            else if (selfPreCenter.y > selfCenter.y || otherPreCenter.y < otherCenter.y) {
                // console.log("checkPart-->bottom be hit");
                if(otherAabb.xMax <= leftBorder){
                    part = EventType.cPartBottomLeft;
                }
                else if(otherAabb.xMin >= rightBorder){
                    part = EventType.cPartBottomRight;
                }
                else{
                    part = EventType.cPartBottom;
                }
            }
        }
        
        // check corner
        if(!part){
            //left
            if (selfPreCenter.x > selfCenter.x || otherPreCenter.x < otherCenter.x) {
                // console.log("checkCorner-->left",selfPreCenter.y,selfCenter.y);
                if(selfPreCenter.y < selfCenter.y){
                    part = EventType.cPartTopLeft;
                }
                else{
                    part = EventType.cPartBottomLeft;
                }
            }
            //right
            else if (selfPreCenter.x < selfCenter.x || otherPreCenter.x > otherCenter.x) {
                // console.log("checkCorner-->right",selfPreCenter.y,selfCenter.y);
                if(selfPreCenter.y < selfCenter.y){
                    part = EventType.cPartTopRight;
                }
                else{
                    part = EventType.cPartBottomRight;
                }
            }
        }
        
        // if(!part){
        //     console.log("part!==undefined------------------------------------------------->");
        // }

        return part;
    },
    
    onCollisionStay: function (other, self) {
        
    },
    
    onCollisionExit: function (other, self) {
        // console.log("onCollisionExit");
        // this.node.color = cc.Color.WHITE;
       
        var event = new cc.Event.EventCustom(EventType.aConlliderExit, true);
        var userData = {};
        userData.other = other;
        userData.actor = self;
        
        var otherPreAabb = other.world.aabb;
        var selfPreCAabb = self.world.aabb;
        var otherAabb = other.world.preAabb;
        var selfAabb = self.world.preAabb;
        
        // otherAabb = other.world.aabb;
        // selfAabb = self.world.aabb;
        // otherPreAabb = other.world.preAabb;
        // selfPreCAabb = self.world.preAabb;
        
        userData.part = this.checkPart(otherAabb,selfAabb,otherPreAabb,selfPreCAabb);

        event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
