var EventType = require("EventType");
var DirectionType = require("DirectionType");

var ColliderGroupMapping = require("ColliderGroupMapping");
var ColliderGroupEnum = require("ColliderGroupEnum");

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
        activeOnEnable : true,
    },

    // use this for initialization
    onLoad: function () {
        
        this.initListener();

    },
    
    onEnable: function () {

        this.enable = this.activeOnEnable;
    },
    
    onDisable: function () {

    },
    
    initListener: function(){
        this.node.on(EventType.ConlliderEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
    },
    
    componentEnable : function( event ){
        var userData = event.getUserData();
        if(!userData.enable){
            userData.enable = true;
        }
        this.enable = userData.enable;
    },
    
    onCollisionEnter: function (other, self) {
        if(this.enable!==true){
            return;
        }
        // console.log("onCollisionEnter");

        //conllider
        // ConlliderEnable : 10,
        // ConlliderEnter : 11,
        // ConlliderStay : 12,
        // ConlliderExit : 13,
        
        var event = new cc.Event.EventCustom(EventType.ConlliderEnter, true);
        var userData = {};
        userData.other = other;
        userData.actor = self;
        
        var otherAabb = other.world.aabb;
        var selfAabb = self.world.aabb;
        var otherPreAabb = other.world.preAabb;
        var selfPreAabb = self.world.preAabb;

        // check part 
        var customFormDirection = this.customFormDirectionFromPart(other, self , true);
        userData.direction = customFormDirection.direction;
        userData.tangent = customFormDirection.tangent;
        // console.log("ConlliderEnter",userData.direction);

        event.setUserData(userData);
        this.node.dispatchEvent(event);
        
        // console.log("ConlliderEnter1",this.node.position);
        // console.log("ConlliderEnter5",self.world.aabb.center);
        // console.log("ConlliderEnter6",this.node.parent.convertToNodeSpace(
        //                                 self.world.aabb.center));
                                        
        // console.log("ConlliderEnter",other.world.aabb.center);
        // console.log("ConlliderEnter",self.world.aabb.center);
        // console.log("ConlliderEnter",other.world.preAabb.center);
        // console.log("ConlliderEnter",self.world.preAabb.center);
    },

    checkPart: function(otherAabb,otherPreAabb,selfAabb,selfPreAabb){
        //DirectionType
        // UpLeft:0,
        // Up:1,
        // UpRight:2,
        // RightUp:3,
        // Right:4,
        // RightDown:5,
        // DownRight:6,
        // Down:7,
        // DownLeft:8,
        // LeftDown:9,
        // Left:10,
        // LeftUp:11,

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
        if (cc.Intersection.rectRect(selfPreAabbClone,otherPreAabbClone)) {
            //left be hit
            if ((selfPreCenter.x - selfCenter.x) - (otherPreCenter.x - otherCenter.x) >0) {
                // console.log("checkPart------------>part left be hit");
                if(otherAabb.yMin >= topBorder){
                    part = DirectionType.LeftUp;
                }
                else if(otherAabb.yMax <= bottomBorder){
                    part = DirectionType.LeftDown;
                }
                else{
                    part = DirectionType.Left;
                }
            }
            //right be hit
            else if ((selfPreCenter.x - selfCenter.x) - (otherPreCenter.x - otherCenter.x) <0) {
                // console.log("checkPart------------>part right be hit");
                if(otherAabb.yMin >= topBorder){
                    part = DirectionType.RightUp;
                }
                else if(otherAabb.yMax <= bottomBorder){
                    part = DirectionType.RightDown;
                }
                else{
                     part = DirectionType.Right;
                }
            }
            // console.log("part------------>1",part);
            if(part!==undefined){
                return part;
            }
        }
        
        //check y-axis
        otherPreAabbClone = otherPreAabb.clone();
        selfPreAabbClone = selfPreAabb.clone();
        otherPreAabbClone.y = otherAabb.y;
        selfPreAabbClone.y = selfAabb.y;
        if (cc.Intersection.rectRect(selfPreAabbClone,otherPreAabbClone)) {
            //top be hit
            if ((selfPreCenter.y - selfCenter.y) - (otherPreCenter.y - otherCenter.y) < 0) {
                // console.log("checkPart-->part top be hit");
                if(otherAabb.xMax <= leftBorder){
                    part = DirectionType.UpLeft;
                }
                else if(otherAabb.xMin >= rightBorder){
                    part = DirectionType.UpRight;
                }
                else{
                    part = DirectionType.Up;
                }
            }
            //bottom be hit
            else if ((selfPreCenter.y - selfCenter.y) - (otherPreCenter.y - otherCenter.y) > 0) {
                // console.log("checkPart-->part bottom be hit");
                if(otherAabb.xMax <= leftBorder){
                    part = DirectionType.DownLeft;
                }
                else if(otherAabb.xMin >= rightBorder){
                    part = DirectionType.DownRight;
                }
                else{
                    part = DirectionType.Down;
                }
            }
            // console.log("part------------>2",part);
            if(part!==undefined){
                return part;
            }
        }
        
        // check corner
        if(part===undefined){
            //left
            if (selfPreCenter.x > selfCenter.x || otherPreCenter.x < otherCenter.x) {
                if(selfPreCenter.y < selfCenter.y || otherPreCenter.y > otherCenter.y){
                    part = DirectionType.UpLeft;
                }
                else{
                    part = DirectionType.DownLeft;
                }
            }
            //right
            else if (selfPreCenter.x < selfCenter.x || otherPreCenter.x > otherCenter.x) {
                if(selfPreCenter.y < selfCenter.y || otherPreCenter.y > otherCenter.y){
                    part = DirectionType.UpRight;
                }
                else{
                     part = DirectionType.DownRight;
                }
            }
            // console.log("part------------>3",part);
        }
        
        // if(part===undefined){
        //     console.log("part===undefined------------------------------------------------->");
        // }
        // else{
            // console.log("part------------>4",part);
        // }
        
        return part;
    },
    
    customFormDirectionFromPart : function(other, self ,enter){
        var direction;
        var tangent=false;
        
        var otherAabb = other.world.aabb;
        var selfAabb = self.world.aabb;
        var otherPreAabb = other.world.preAabb;
        var selfPreAabb = self.world.preAabb;
        
        var part;
        if(enter){
            part = this.checkPart(otherAabb,otherPreAabb,selfAabb,selfPreAabb);
        }
        else{
            part = this.checkPart(otherPreAabb,otherAabb,selfPreAabb,selfAabb);
        }

        // console.log("customFormDirectionFromPart-->",part);

        if(part == DirectionType.Left){
            direction = DirectionType.Left;
        }
        else if(part == DirectionType.LeftUp){
            if(otherPreAabb.yMin == selfPreAabb.yMax || otherAabb.yMin == selfAabb.yMax){//Exclude press
                direction = DirectionType.Up;
                tangent = true;
            }
            else{
                direction = DirectionType.Left;
            }
        }
        else if(part == DirectionType.LeftDown){
            if(otherPreAabb.yMax == selfPreAabb.yMin || otherAabb.yMax == selfAabb.yMin){//Exclude landing
                direction = DirectionType.Down;
                tangent = true;
            }
            else{
                direction = DirectionType.Left;
            }
        }
        
        if(part == DirectionType.Right){
            direction = DirectionType.Right;
        }
        else if(part == DirectionType.RightUp){
            if(otherPreAabb.yMin == selfPreAabb.yMax || otherAabb.yMin == selfAabb.yMax){
                direction = DirectionType.Up;
                tangent = true;
            }
            else{
                direction = DirectionType.Right;
            }
        }
        else if(part == DirectionType.RightDown){
            if(otherPreAabb.yMax == selfPreAabb.yMin || otherAabb.yMax == selfAabb.yMin){
                direction = DirectionType.Down;
                tangent = true;
            }
            else{
                direction = DirectionType.Right;
            }
        }
        
        if(part == DirectionType.Up){
            direction = DirectionType.Up;
        }
        else if(part == DirectionType.UpLeft){
            if(otherPreAabb.xMax == selfPreAabb.xMin || otherAabb.xMax == selfAabb.xMin){//Exclude left
                direction = DirectionType.Left;
                tangent = true;
            }
            else{
                direction = DirectionType.Up;
            }
        }
        else if(part == DirectionType.UpRight){
            if(otherPreAabb.xMin == selfPreAabb.xMax || otherAabb.xMin == selfAabb.xMax){//Exclude right
                direction = DirectionType.Right;
                tangent = true;
            }
            else{
                direction = DirectionType.Up;
            }
        }
        
        if(part == DirectionType.Down){
            direction = DirectionType.Down;
        }
        else if(part == DirectionType.DownLeft){
            if(otherPreAabb.xMax == selfPreAabb.xMin || otherAabb.xMax == selfAabb.xMin){
                direction = DirectionType.Left;
                tangent = true;
            }
            else{
                direction = DirectionType.Down;
            }
        }
        else if(part == DirectionType.DownRight){
            if(otherPreAabb.xMin == selfPreAabb.xMax || otherAabb.xMin == selfAabb.xMax){
                direction = DirectionType.Right;
                tangent = true;
            }
            else{
                direction = DirectionType.Down;
            }
        }
        
        return {direction,tangent};
    },
    
    onCollisionStay: function (other, self) {
        if(this.enable!==true){
            return;
        }
        
    },
    
    onCollisionExit: function (other, self) {
        if(this.enable!==true){
            return;
        }
        
        // console.log("onCollisionExit",other.node.group);
        var event = new cc.Event.EventCustom(EventType.ConlliderExit, true);
        var userData = {};
        userData.other = other;
        userData.actor = self;
        
        var customFormDirection = this.customFormDirectionFromPart(other, self , false);
        userData.direction = customFormDirection.direction;
        userData.tangent = customFormDirection.tangent;
        
        // console.log("onCollisionExit",userData.direction,userData.tangent,this.node.group);
        
        event.setUserData(userData);
        this.node.dispatchEvent(event);
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
