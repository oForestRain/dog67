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
        // ...
    },

    // use this for initialization
    onLoad: function () {
        
        this.leftLockCount= 0;
        this.rightLockCount = 0;
        this.landingLockCount = 0;

        this.initListener();
    },
    
    // //conllider
    // aConlliderEnter : "ActorConlliderEnter",
    // aConlliderStay : "ActorConlliderStay",
    // aConlliderExit : "ActorConlliderExit",
    // //conlliderPart
    // cPartLeft : "ConlliderPartLeft",
    // cPartRight : "ConlliderPartRight",
    // cPartTop : "ConlliderPartTop",
    // cPartBottom : "ConlliderPartBottom",
    // cPartLeftTop : "ConlliderPartLeftTop",
    // cPartLeftBottom : "ConlliderPartLeftBottom",
    // cPartRightTop : "ConlliderPartRightTop",
    // cPartRightBottom : "ConlliderPartRightBottom",
    // cPartTopLeft : "ConlliderPartTopLeft",
    // cPartTopRight : "ConlliderPartTopRight",
    // cPartBottomLeft : "ConlliderPartBottomLeft",
    // cPartBottomRight : "ConlliderPartRightBottomRight",
    
    initListener : function(){
        this.node.on(EventType.aConlliderEnter, 
            function (event) {
                this.enterHandler(event);
            },
            this);
        this.node.on(EventType.aConlliderStay, 
            function (event) {
                this.stayHandler(event);
            },
            this);
        this.node.on(EventType.aConlliderExit, 
            function (event) {
                this.exitHandler(event);
            },
            this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    enterHandler : function( event ){
        var userData = event.getUserData();
        // console.log("enterHandler-->",userData.other.node.group);

        // if(userData === null || userData.other === null || userData.other.node === null){
            // return;
        // }
        
        switch(userData.other.node.group){
            case EventType.Enemy:
                this.enterEnemy(userData);
                break;
            case EventType.Terrain:
                this.enterTerrain(userData);
                break;
        }
        
        if(this.leftLockCount || this.rightLockCount || this.landingLockCount){
            this.node.color = cc.Color.RED;
        }
        // console.log("enterHandler-->",this.leftLockCount,this.rightLockCount,this.landingLockCount);
    },
    
    enterEnemy : function( userData ){
        
    },

    enterTerrain : function( userData ){
        // if(userData === null){
        //     return;
        // }
        
        this.enterTerrainCheckBorder(userData);
        
        // console.log("enterTerrainCheckBorder-->",this.leftLockCount,this.rightLockCount,this.landingLockCount);
    },
    
    enterTerrainCheckBorder : function(userData){
        var part = userData.part;

        var otherPreAabb = userData.other.world.preAabb;
        var selfPreAabb = userData.actor.world.preAabb;
        var otherAabb = userData.other.world.aabb;
        var selfAabb = userData.actor.world.aabb;
        
        var enter = true;

        // console.log("enterTerrainCheckBorder-->",part);
        if(part == EventType.cPartLeft){
            this.stopLeft(userData,enter);
        }
        else if(part == EventType.cPartLeftTop){
            if(otherPreAabb.yMin == selfPreAabb.yMax || otherAabb.yMin == selfAabb.yMax){//Exclude press
                this.stopUp(userData,enter);
            }
            else{
                this.stopLeft(userData,enter);
            }
        }
        else if(part == EventType.cPartLeftBottom){
            if(otherPreAabb.yMax == selfPreAabb.yMin || otherAabb.yMax == selfAabb.yMin){//Exclude landing
                this.landingTerrain(userData,enter);
            }
            else{
                this.stopLeft(userData,enter);
            }
        }
        
        if(part == EventType.cPartRight){
            this.stopRight(userData,enter);
        }
        else if(part == EventType.cPartRightTop){
            if(otherPreAabb.yMin == selfPreAabb.yMax || otherAabb.yMin == selfAabb.yMax){
                this.stopUp(userData,enter);
            }
            else{
                this.stopRight(userData,enter);
            }
        }
        else if(part == EventType.cPartRightBottom){
            if(otherPreAabb.yMax == selfPreAabb.yMin || otherAabb.yMax == selfAabb.yMin){
                this.landingTerrain(userData,enter);
            }
            else{
                this.stopRight(userData,enter);
            }
        }
        
        if(part == EventType.cPartTop){
            this.stopUp(userData,enter);
        }
        else if(part == EventType.cPartTopLeft){
            if(otherPreAabb.xMax == selfPreAabb.xMin || otherAabb.xMax == selfAabb.xMin){//Exclude left
                this.stopLeft(userData,enter);
            }
            else{
                this.stopUp(userData,enter);
            }
        }
        else if(part == EventType.cPartTopRight){
            if(otherPreAabb.xMin == selfPreAabb.xMax || otherAabb.xMin == selfAabb.xMax){//Exclude right
                this.stopRight(userData,enter);
            }
            else{
                this.stopUp(userData,enter);
            }
        }
        
        if(part == EventType.cPartBottom){
            this.landingTerrain(userData,enter);
        }
        else if(part == EventType.cPartBottomLeft){
            if(otherPreAabb.xMax == selfPreAabb.xMin || otherAabb.xMax == selfAabb.xMin){
                this.stopLeft(userData,enter);
            }
            else{
                this.landingTerrain(userData,enter);
            }
        }
        else if(part == EventType.cPartBottomRight){
            if(otherPreAabb.xMin == selfPreAabb.xMax || otherAabb.xMin == selfAabb.xMax){
                this.stopRight(userData,enter);
            }
            else{
                this.landingTerrain(userData,enter);
            }
        }
    },

    stopLeft : function( userData,bool){
        var otherPreAabb = userData.other.world.preAabb;
        var otherAabb = userData.other.world.aabb;
        var selfAabb = userData.actor.world.aabb;
        
        var enterLock = bool;

        if(enterLock){
            this.leftLockCount++;
            this.lockLeft(enterLock);
            this.node.x = otherAabb.xMax + selfAabb.width*.5;
        }
        else{
            this.leftLockCount--;
            if(this.leftLockCount===0){
                this.lockLeft(enterLock);
            }
        }
        
        // console.log("stopLeft-->","left:",this.leftLockCount,bool);
    },
    
    stopRight : function( userData,bool){
        var otherPreAabb = userData.other.world.preAabb;
        var otherAabb = userData.other.world.aabb;
        var selfAabb = userData.actor.world.aabb;
        
        var enterLock = bool;
        
        if(enterLock){
            this.rightLockCount++;
            this.lockRight(enterLock);
            this.node.x = otherAabb.xMin - selfAabb.width*.5;
        }
        else{
            this.rightLockCount--;
            if(this.rightLockCount===0){
                this.lockRight(enterLock);
            }
        }

        // console.log("stopRight-->","right:",this.rightLockCount,bool);
    },
    
    stopUp : function( userData,bool ){
        var otherAabb = userData.other.world.aabb;
        var selfAabb = userData.actor.world.aabb;
        
        var enterLock = bool;
        
        if(enterLock){
            this.lockUp();
            this.node.y = otherAabb.yMin - selfAabb.height*.5 - 1;
        }
        // console.log("stopUp-->",bool);
    },
    
    landingTerrain : function( userData,bool ){
        var otherPreAabb = userData.other.world.preAabb;
        var otherAabb = userData.other.world.aabb;
        var selfPreAabb = userData.actor.world.preAabb;
        var selfAabb = userData.actor.world.aabb;
        
        var enterLock = bool;

        if(enterLock){
            this.landingLockCount++;
            this.landing();
            this.node.y = otherAabb.yMax + selfAabb.height*.5;
        }
        else{
            this.landingLockCount--;
            if(this.landingLockCount===0){
                if(selfPreAabb.center.y == selfAabb.center.y){
                    this.fallDown();
                }
                this.landingLockCount = 0;
            }
        }
        // console.log("landingTerrain-->","landing:",this.landingLockCount,bool);
    },
    
    lockLeft : function(bool){
        var event = new cc.Event.EventCustom(EventType.aMLeftLockEvent, true );
        var data = {};
        data.bool = bool;
        event.setUserData(data);
        this.node.dispatchEvent( event );
        
        // console.log("lockLeft-->");
    },
    
    lockRight : function(bool){
        var event = new cc.Event.EventCustom(EventType.aMRightLockEvent, true );
        var data = {};
        data.bool = bool;
        event.setUserData(data);
        this.node.dispatchEvent( event );
        
        // console.log("lockRight-->");
    },
    
    lockUp : function( ){
        var event = new cc.Event.EventCustom(EventType.aUpLockEvent, true );
        this.node.dispatchEvent( event );
        
        // console.log("lockUp-->");
    },
    
    lockJump : function( ){
        var event = new cc.Event.EventCustom(EventType.aJumpLockEvent, true );
        this.node.dispatchEvent( event );
        
        // console.log("lockJump-->");
    },
    
    landing : function( ){
        var event = new cc.Event.EventCustom(EventType.aLandingEvent, true );
        this.node.dispatchEvent( event );
        
        // console.log("landing-->",this.landingLockCount);
    },
    
    fallDown : function( ){
        var event = new cc.Event.EventCustom(EventType.aFallDownEvent, true );
        this.node.dispatchEvent( event );
        
        // console.log("fallDown-->",this.landingLockCount);
    },
    
    stayHandler : function( event ){
      
    },
    
    exitHandler : function( event ){
        var userData = event.getUserData();
        // console.log("exitHandler-->",userData.other.node.group);
        
        // if(userData === null || userData.other === null || userData.other.node === null){
            // return;
        // }
        
        switch(userData.other.node.group){
            case EventType.Enemy:
                this.exitEnemy(userData);
                break;
            case EventType.Terrain:
                this.exitTerrain(userData);
                break;
        }
        
        if(!this.leftLockCount && !this.rightLockCount && !this.landingLockCount){
            this.node.color = cc.Color.WHITE;
        }
        // console.log("exitHandler-->",!this.leftLockCount,!this.rightLockCount,!this.landingLockCount);
    },
    
    exitEnemy : function( userData ){
        
    },

    exitTerrain : function( userData ){
        // if(userData === null){
        //     return;
        // }
        
        this.exitTerrainCheckBorder(userData);
        
        // console.log("exitTerrain-->",this.leftLockCount,this.rightLockCount,this.landingLockCount);
    },
    
    exitTerrainCheckBorder : function(userData){
        var part = userData.part;

        var otherPreAabb = userData.other.world.preAabb;
        var selfPreAabb = userData.actor.world.preAabb;
        var otherAabb = userData.other.world.aabb;
        var selfAabb = userData.actor.world.aabb;

        var enter = false;

        // console.log("exitTerrainCheckBorder-->",part);
        if(part == EventType.cPartLeft){
            this.stopLeft(userData,enter);
        }
        else if(part == EventType.cPartLeftTop){
            if(this.leftLockCount>0){
                this.stopLeft(userData,enter);
            }
            else{
                this.stopUp(userData,enter);
            }
        }
        else if(part == EventType.cPartLeftBottom){
            if(this.leftLockCount>0){
                this.stopLeft(userData,enter);
            }
            else{
                this.landingTerrain(userData,enter);
            }
        }
        
        if(part == EventType.cPartRight){
            this.stopRight(userData,enter);
        }
        else if(part == EventType.cPartRightTop){
            if(this.rightLockCount>0){
                this.stopRight(userData,enter);
            }
            else{
                this.stopUp(userData,enter);
            }
        }
        else if(part == EventType.cPartRightBottom){
            if(this.rightLockCount>0){
                this.stopRight(userData,enter);
            }
            else{
                this.landingTerrain(userData,enter);
            }
        }
        
        if(part == EventType.cPartTop){
            this.stopUp(userData,enter);
        }
        else if(part == EventType.cPartTopLeft){
            if(this.leftLockCount>0){
                this.stopLeft(userData,enter);
            }
            else{
                this.stopUp(userData,enter);
            }
        }
        else if(part == EventType.cPartTopRight){
            if(this.rightLockCount>0){
                this.stopRight(userData,enter);
            }
            else{
                this.stopUp(userData,enter);
            }
        }
        
        if(part == EventType.cPartBottom){
            this.landingTerrain(userData,enter);
        }
        else if(part == EventType.cPartBottomLeft){
            if(this.landingLockCount > 0){
                this.landingTerrain(userData,enter);
            }
            else{
                this.stopLeft(userData,enter);
            }
            // if(otherPreAabb.xMax == selfPreAabb.xMin || otherAabb.xMax == selfAabb.xMin){
            //     this.stopLeft(userData,enter);
            //     if(!enter){
            //         if(this.landingLockCount > 0){
            //             this.landingTerrain(userData,enter);
            //         }
            //     }
            // }
            // else{
            //     this.landingTerrain(userData,enter);
            // }
        }
        else if(part == EventType.cPartBottomRight){
            // if(otherPreAabb.xMin == selfPreAabb.xMax || otherAabb.xMin == selfAabb.xMax){
            //     this.stopRight(userData,enter);
            //     if(!enter){
            //         if(this.landingLockCount > 0){
            //             this.landingTerrain(userData,enter);
            //         }
            //     }
            // }
            // else{
            //     this.landingTerrain(userData,enter);
            // }
            if(this.landingLockCount > 0){
                this.landingTerrain(userData,enter);
            }
            else{
                this.stopRight(userData,enter);
            }
        }
    },
});