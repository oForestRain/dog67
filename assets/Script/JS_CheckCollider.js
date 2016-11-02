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
        var selfPreAabb = self.world.preAabb;
        
        // check part 
        userData.part = this.checkPart(otherAabb,selfAabb,otherPreAabb,selfPreAabb);

        event.setUserData(userData);
        this.node.dispatchEvent(event);
    },

    checkPart: function(otherAabb,selfAabb,otherPreAabb,selfPreAabb){
        ////direction
        // dLeft:"DirectionLeft",
        // dRight:"DirectionRight",
        // dUp:"DirectionUp",
        // dDown:"DirectionDown",
        // dLU:"DirectionLeftUp",
        // dLD:"DirectionLeftDown",
        // dRU:"DirectionRightUp",
        // dRD:"DirectionRightDown",
        // dUL:"DirectionUpLeft",
        // dUR:"DirectionUpRight",
        // dDL:"DirectionDownLeft",
        // dDR:"DirectionDownRight",

        var otherCenter = otherAabb.center;
        var selfCenter = selfAabb.center;
        
        var otherPreCenter = otherPreAabb.center;
        var selfPreCenter = selfPreAabb.center;
        
        var leftBorder = selfCenter.x-selfAabb.width*this.leftOffsetRate*.5;
        var rightBorder = selfCenter.x+selfAabb.width*this.rightOffsetRate*.5;
        var topBorder = selfCenter.y+selfAabb.height*this.topOffsetRate*.5;
        var bottomBorder = selfCenter.y-selfAabb.height*this.bottomOffsetRate*.5;
        
        var part;
        
        //check x-axis
        var otherPreAabbClone = otherPreAabb.clone();
        var selfPreAabbClone = selfPreAabb.clone();
        otherPreAabbClone.x = otherAabb.x;
        selfPreAabbClone.x = selfAabb.x;
        // console.log("checkPartX-->",selfPreCenter.x,selfCenter.x,otherPreCenter.x,otherCenter.x);
        if (cc.Intersection.rectRect(selfPreAabbClone,otherPreAabbClone)) {
            //left be hit
            if (selfPreCenter.x > selfCenter.x || otherPreCenter.x < otherCenter.x) {
                // console.log("part------------>left be hit");
                if(otherAabb.yMin >= topBorder){
                    part = EventType.dLU;
                }
                else if(otherAabb.yMax <= bottomBorder){
                    part = EventType.dLD;
                }
                else{
                    part = EventType.dLeft;
                }
            }
            //right be hit
            else if (selfPreCenter.x < selfCenter.x || otherPreCenter.x > otherCenter.x) {
                // console.log("part------------>right be hit");
                if(otherAabb.yMin >= topBorder){
                    part = EventType.dRU;
                }
                else if(otherAabb.yMax <= bottomBorder){
                    part = EventType.dRD;
                }
                else{
                     part = EventType.dRight;
                }
            }
            // console.log("part------------>1",part);
            if(!part){
                return part;
            }
        }
        
        //check y-axis
        otherPreAabbClone = otherPreAabb.clone();
        selfPreAabbClone = selfPreAabb.clone();
        otherPreAabbClone.y = otherAabb.y;
        selfPreAabbClone.y = selfAabb.y;
        // console.log("checkPartY-->",selfPreCenter.y,selfCenter.y,otherPreCenter.y,otherCenter.y);
        if (cc.Intersection.rectRect(selfPreAabbClone,otherPreAabbClone)) {
            //top be hit
            if (selfPreCenter.y < selfCenter.y || otherPreCenter.y > otherCenter.y) {
                // console.log("checkPart-->top be hit");
                if(otherAabb.xMax <= leftBorder){
                    part = EventType.dUL;
                }
                else if(otherAabb.xMin >= rightBorder){
                    part = EventType.dUR;
                }
                else{
                    part = EventType.dUp;
                }
            }
            //bottom be hit
            else if (selfPreCenter.y > selfCenter.y || otherPreCenter.y < otherCenter.y) {
                // console.log("checkPart-->bottom be hit");
                if(otherAabb.xMax <= leftBorder){
                    part = EventType.dDL;
                }
                else if(otherAabb.xMin >= rightBorder){
                    part = EventType.dDR;
                }
                else{
                    part = EventType.dDown;
                }
            }
            // console.log("part------------>2",part);
            if(!part){
                return part;
            }
        }
        
        
        // check corner
        if(!part){
            //left
            if (selfPreCenter.x > selfCenter.x || otherPreCenter.x < otherCenter.x) {
                // console.log("checkCorner-->left",selfPreCenter.x,selfCenter.x);
                if(selfPreCenter.y < selfCenter.y || otherPreCenter.y > otherCenter.y){
                    part = EventType.dUL;
                }
                else{
                    part = EventType.dDL;
                }
            }
            //right
            else if (selfPreCenter.x < selfCenter.x || otherPreCenter.x > otherCenter.x) {
                // console.log("checkCorner-->right",selfPreCenter.y,selfCenter.y);
                if(selfPreCenter.y < selfCenter.y || otherPreCenter.y > otherCenter.y){
                    part = EventType.dUR;
                }
                else{
                     part = EventType.dDR;
                }
            }
            // console.log("part------------>3",part);
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
