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
        this.initListener();

        this.lockArray = [];

        this.enable = false;
    },
    
    onEnable: function () {
        this.lockArray.length = 0;

        this.enable = false;
    },
    
    onDisable: function () {

    },
    
    // //conllider
    // aConlliderEnter : "ActorConlliderEnter",
    // aConlliderStay : "ActorConlliderStay",
    // aConlliderExit : "ActorConlliderExit",
    // //conlliderPart
    // cCheckPart : "ConlliderCheckPart",
    // //direction
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
    
    initListener : function(){
        this.node.on(EventType.aConlliderEnable, 
            function (event) {
                this.conlliderEnable(event);
            },
            this);
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
        this.node.on(EventType.cEnterArrayDisable, 
            function (event) {
                this.exitFromDisable(event);
            },
            this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    conlliderEnable : function( event ){
        
        var userData = event.getUserData();

        this.enable = userData.enable;
    },
    
    enterHandler : function( event ){
        if(!this.enable){
            return;
        }
        
        var userData = event.getUserData();
        // console.log("enterHandler-->",userData.other.node.group);

        // if(userData === null || userData.other === null || userData.other.node === null){
            // return;
        // }
        var actorGroup = userData.actor.node.group;
        var otherGroup = userData.other.node.group;
        
        if(otherGroup == EventType.Terrain && actorGroup == EventType.Player && otherGroup == EventType.Terrain ||
            actorGroup == EventType.Enemy && otherGroup == EventType.Terrain ||
            // actorGroup == EventType.Terrain && (otherGroup == EventType.Player ||
            //                                     otherGroup == EventType.Enemy ||
            //                                     otherGroup == EventType.Res) ||
            actorGroup == EventType.Res && otherGroup == EventType.Terrain){
            
            this.enterCheckBorder(userData);
         }

        var lockcount = 0;
        for(var kArray in this.lockArray){
            lockcount +=kArray.length;
        }
        if(lockcount){
            this.node.color = cc.Color.RED;
        }
        // console.log("enterHandler-->",this.leftLockCount,this.rightLockCount,this.upLockCount,this.downLockCount);
    },
    
    exitHandler : function( event ){
        // console.log("exitHandler--->");
        var userData = event.getUserData();
        var other = userData.other.node;

        var direction = this.exitFrom(other);
        this.colliderCheck(direction,userData);
        
        var lockcount = 0;
        for(var kArray in this.lockArray){
            lockcount +=kArray.length;
        }
        if(lockcount){
            this.node.color = cc.Color.WHITE;
        }
    },

    enterCheckBorder : function(userData){
        var part = userData.part;

        var otherPreAabb = userData.other.world.preAabb;
        var selfPreAabb = userData.actor.world.preAabb;
        var otherAabb = userData.other.world.aabb;
        var selfAabb = userData.actor.world.aabb;
        
        var direction;
        var other = userData.other.node;

        // console.log("enterCheckBorder-->part",part,other);
        
        if(part == EventType.dLeft){
            direction = EventType.dLeft;
        }
        else if(part == EventType.dLU){
            if(otherPreAabb.yMin == selfPreAabb.yMax || otherAabb.yMin == selfAabb.yMax){//Exclude press
                direction = EventType.dUp;
            }
            else{
                direction = EventType.dLeft;
            }
        }
        else if(part == EventType.dLD){
            if(otherPreAabb.yMax == selfPreAabb.yMin || otherAabb.yMax == selfAabb.yMin){//Exclude landing
                direction = EventType.dDown;
            }
            else{
                direction = EventType.dLeft;
            }
        }
        
        if(part == EventType.dRight){
            direction = EventType.dRight;
        }
        else if(part == EventType.dRU){
            if(otherPreAabb.yMin == selfPreAabb.yMax || otherAabb.yMin == selfAabb.yMax){
                direction = EventType.dUp;
            }
            else{
                direction = EventType.dRight;
            }
        }
        else if(part == EventType.dRD){
            if(otherPreAabb.yMax == selfPreAabb.yMin || otherAabb.yMax == selfAabb.yMin){
                direction = EventType.dDown;
            }
            else{
                direction = EventType.dRight;
            }
        }
        
        if(part == EventType.dUp){
            direction = EventType.dUp;
        }
        else if(part == EventType.dUL){
            if(otherPreAabb.xMax == selfPreAabb.xMin || otherAabb.xMax == selfAabb.xMin){//Exclude left
                direction = EventType.dLeft;
            }
            else{
                direction = EventType.dUp;
            }
        }
        else if(part == EventType.dUR){
            if(otherPreAabb.xMin == selfPreAabb.xMax || otherAabb.xMin == selfAabb.xMax){//Exclude right
                direction = EventType.dRight;
            }
            else{
                direction = EventType.dUp;
            }
        }
        
        if(part == EventType.dDown){
            direction = EventType.dDown;
        }
        else if(part == EventType.dDL){
            if(otherPreAabb.xMax == selfPreAabb.xMin || otherAabb.xMax == selfAabb.xMin){
                direction = EventType.dLeft;
            }
            else{
                direction = EventType.dDown;
            }
        }
        else if(part == EventType.dDR){
            if(otherPreAabb.xMin == selfPreAabb.xMax || otherAabb.xMin == selfAabb.xMax){
                direction = EventType.dRight;
            }
            else{
                direction = EventType.dDown;
            }
        }
        
        // console.log("enterCheckBorder-->direction",direction,other,userData);
        
        this.enterAt(direction,other);
        
        this.colliderCheck(direction,userData);
    },
    
    enterAt : function(direction,other){
        var lArray;
        if(!this.lockArray[direction]){
            this.lockArray[direction] = [];
        }
        lArray = this.lockArray[direction];
        lArray.push(other);
        
        var event = new cc.Event.EventCustom(EventType.cAddToArray, true );
        var data = {};
        data.actor = this.node;
        data.other = other;
        event.setUserData(data);
        other.dispatchEvent( event );
        
        // console.log("enterAt-->",direction,this.lockArray[direction].length,other.group);
    },
    
    exitFrom : function( other ){
        // console.log("exitFrom-->",other.group);
        var event = new cc.Event.EventCustom(EventType.cRemoveFromArray, true );
        var data = {};
        data.actor = this.node;
        event.setUserData(data);
        other.dispatchEvent(event);
        
        var direction;
        var kArray;
        for(var key in this.lockArray){
            // console.log("exitFrom-->key",key,this.lockArray.length);
            kArray = this.lockArray[key];
            for(var j in kArray){
                if(kArray[j]===other){
                    // console.log("exitFrom-->j1",key,j,kArray.length);
                    direction = key;
                    kArray.splice(j,1);
                    // console.log("exitFrom-->j2",key,j,kArray.length,kArray[j]);
                    return direction;
                }
            }
        }
    },
    
    exitFromDisable : function( other ){
        // console.log("exitFromDisable-->",other.group);
        var direction;
        var kArray;
        for(var key in this.lockArray){
            kArray = this.lockArray[key];
            for(var j in kArray){
                if(kArray[j]===other){
                    // console.log("exitFrom-->j1",key,j,kArray.length);
                    direction = key;
                    kArray.splice(j,1);
                    // console.log("exitFrom-->j2",key,j,kArray.length,kArray[j]);
                    return direction;
                }
            }
        }
    },
    
    colliderCheck: function( direction , userData ){
        // console.log("colliderCheck-->");
        var kArray;
        if(!this.lockArray[direction]){
            this.lockArray[direction] = [];
        }
        var kArray = this.lockArray[direction];
        
        if(kArray.length>0){
            var other = userData.other;
            var actor = userData.actor;
            var otherAabb = other.world.aabb;
            var actorAabb = actor.world.aabb;
        }
        
        // console.log("colliderCheck-->",direction,kArray,kArray.length);

        var event;
        var data;
        switch (direction) {
            case EventType.dUp:
                if(kArray.length>0){
                    event = new cc.Event.EventCustom(EventType.aUpLock, true );
                    this.node.y = otherAabb.yMin - actorAabb.height*.5 - 1;
                }
                break;
            case EventType.dDown:
                if(kArray.length>0){
                    event = new cc.Event.EventCustom(EventType.aLanding, true );
                    this.node.y = otherAabb.yMax + actorAabb.height*.5;
                }
                else{
                    event = new cc.Event.EventCustom(EventType.aFallDown, true );
                }
                break;
            case EventType.dLeft:
            case EventType.dRight:
                event = new cc.Event.EventCustom(EventType.aLock, true );
                data = {};
                data.direction = direction;
                data.bool = (kArray.length>0);
                event.setUserData(data);
                if(data.bool){
                    if(direction == EventType.dLeft){
                        this.node.x = otherAabb.xMax + actorAabb.width*.5
                    }
                    else{
                        this.node.x = otherAabb.xMin - actorAabb.width*.5;
                    }
                }
                break;
        }
        
        if(event){
            // console.log("colliderCheck-->event",event.type);
            this.node.dispatchEvent( event );
        }
    },
    
    // stopLeft : function( userData,bool){
    //     var enterLock = bool;
    //     var offset2d;

    //     if(enterLock){
    //         this.leftLockCount++;
           
    //         this.lockLeft(enterLock,userData);
    //     }
    //     else{
    //         this.leftLockCount--;
    //         if(this.leftLockCount===0){
    //             this.lockLeft(enterLock,offset2d);
    //         }
    //     }
        
    //     // console.log("stopLeft-->","left:",this.leftLockCount,bool);
    // },
    
    // stopRight : function( userData,bool){
    //     var otherPreAabb = userData.other.world.preAabb;
    //     var otherAabb = userData.other.world.aabb;
    //     var selfAabb = userData.actor.world.aabb;
        
    //     var enterLock = bool;
        
    //     if(enterLock){
    //         this.rightLockCount++;
    //         this.lockRight(enterLock);
    //         this.node.x = otherAabb.xMin - selfAabb.width*.5;
    //     }
    //     else{
    //         this.rightLockCount--;
    //         if(this.rightLockCount===0){
    //             this.lockRight(enterLock);
    //         }
    //     }

    //     // console.log("stopRight-->","right:",this.rightLockCount,bool);
    // },
    
    // stopUp : function( userData,bool ){
    //     var otherAabb = userData.other.world.aabb;
    //     var selfAabb = userData.actor.world.aabb;
        
    //     var enterLock = bool;
        
    //     if(enterLock){
    //         this.lockUp();
    //         this.node.y = otherAabb.yMin - selfAabb.height*.5 - 1;
    //     }
    //     // console.log("stopUp-->",bool);
    // },
    
    // stopDown : function( userData,bool ){
    //     var otherPreAabb = userData.other.world.preAabb;
    //     var otherAabb = userData.other.world.aabb;
    //     var selfPreAabb = userData.actor.world.preAabb;
    //     var selfAabb = userData.actor.world.aabb;
        
    //     var enterLock = bool;

    //     if(enterLock){
    //         this.landingLockCount++;
    //         this.landing();
    //         this.node.y = otherAabb.yMax + selfAabb.height*.5;
    //     }
    //     else{
    //         this.landingLockCount--;
    //         if(this.landingLockCount===0){
    //             if(selfPreAabb.center.y == selfAabb.center.y){
    //                 this.fallDown();
    //             }
    //             this.landingLockCount = 0;
    //         }
    //     }
    //     // console.log("landingTerrain-->","landing:",this.landingLockCount,bool);
    // },
    
    // lockLeftRight : function(bool){
    //     var otherPreAabb = userData.other.world.preAabb;
    //     var otherAabb = userData.other.world.aabb;
    //     var selfAabb = userData.actor.world.aabb;
    //     offset2d = new Vec2(this.node.y,otherAabb.xMax + selfAabb.width*.5);
        
    //     var event = new cc.Event.EventCustom(EventType.aLock, true );
        
    //     var data = {};
    //     data.bool = bool;
    //     data.direction = dLeft;
    //     event.setUserData(data);
    //     this.node.dispatchEvent( event );
        
    //     // console.log("lockLeft-->");
    // },
    
    // lockRight : function(bool){
    //     var event = new cc.Event.EventCustom(EventType.aMRightLockEvent, true );
    //     var data = {};
    //     data.bool = bool;
    //     event.setUserData(data);
    //     this.node.dispatchEvent( event );
        
    //     // console.log("lockRight-->");
    // },
    
    // lockUp : function( ){
    //     var event = new cc.Event.EventCustom(EventType.aUpLockEvent, true );
    //     this.node.dispatchEvent( event );
        
    //     // console.log("lockUp-->");
    // },
    
    // lockJump : function( ){
    //     var event = new cc.Event.EventCustom(EventType.aJumpLockEvent, true );
    //     this.node.dispatchEvent( event );
        
    //     // console.log("lockJump-->");
    // },
    
    // landing : function( ){
    //     var event = new cc.Event.EventCustom(EventType.aLandingEvent, true );
    //     this.node.dispatchEvent( event );
        
    //     // console.log("landing-->",this.landingLockCount);
    // },
    
    // fallDown : function( ){
    //     var event = new cc.Event.EventCustom(EventType.aFallDownEvent, true );
    //     this.node.dispatchEvent( event );
        
    //     // console.log("fallDown-->",this.landingLockCount);
    // },
    
    stayHandler : function( event ){
        if(!this.enable){
            return;
        }
    },
    
    // exitCheckBorder : function(userData){
    //     var part = userData.part;

    //     var otherPreAabb = userData.other.world.preAabb;
    //     var selfPreAabb = userData.actor.world.preAabb;
    //     var otherAabb = userData.other.world.aabb;
    //     var selfAabb = userData.actor.world.aabb;

    //     var enter = false;

    //     // console.log("exitTerrainCheckBorder-->",part);
    //     if(part == EventType.dLeft){
    //         this.stopLeft(userData,enter);
    //     }
    //     else if(part == EventType.dLU){
    //         if(this.leftLockCount>0){
    //             this.stopLeft(userData,enter);
    //         }
    //         else{
    //             this.stopUp(userData,enter);
    //         }
    //     }
    //     else if(part == EventType.dLD){
    //         if(this.leftLockCount>0){
    //             this.stopLeft(userData,enter);
    //         }
    //         else{
    //             this.landingTerrain(userData,enter);
    //         }
    //     }
        
    //     if(part == EventType.dRight){
    //         this.stopRight(userData,enter);
    //     }
    //     else if(part == EventType.dRU){
    //         if(this.rightLockCount>0){
    //             this.stopRight(userData,enter);
    //         }
    //         else{
    //             this.stopUp(userData,enter);
    //         }
    //     }
    //     else if(part == EventType.dRD){
    //         if(this.rightLockCount>0){
    //             this.stopRight(userData,enter);
    //         }
    //         else{
    //             this.landingTerrain(userData,enter);
    //         }
    //     }
        
    //     if(part == EventType.dUp){
    //         this.stopUp(userData,enter);
    //     }
    //     else if(part == EventType.dUL){
    //         if(this.leftLockCount>0){
    //             this.stopLeft(userData,enter);
    //         }
    //         else{
    //             this.stopUp(userData,enter);
    //         }
    //     }
    //     else if(part == EventType.dUR){
    //         if(this.rightLockCount>0){
    //             this.stopRight(userData,enter);
    //         }
    //         else{
    //             this.stopUp(userData,enter);
    //         }
    //     }
        
    //     if(part == EventType.dDown){
    //         this.landingTerrain(userData,enter);
    //     }
    //     else if(part == EventType.dDL){
    //         if(this.landingLockCount > 0){
    //             this.landingTerrain(userData,enter);
    //         }
    //         else{
    //             this.stopLeft(userData,enter);
    //         }
    //         // if(otherPreAabb.xMax == selfPreAabb.xMin || otherAabb.xMax == selfAabb.xMin){
    //         //     this.stopLeft(userData,enter);
    //         //     if(!enter){
    //         //         if(this.landingLockCount > 0){
    //         //             this.landingTerrain(userData,enter);
    //         //         }
    //         //     }
    //         // }
    //         // else{
    //         //     this.landingTerrain(userData,enter);
    //         // }
    //     }
    //     else if(part == EventType.dDR){
    //         // if(otherPreAabb.xMin == selfPreAabb.xMax || otherAabb.xMin == selfAabb.xMax){
    //         //     this.stopRight(userData,enter);
    //         //     if(!enter){
    //         //         if(this.landingLockCount > 0){
    //         //             this.landingTerrain(userData,enter);
    //         //         }
    //         //     }
    //         // }
    //         // else{
    //         //     this.landingTerrain(userData,enter);
    //         // }
    //         if(this.landingLockCount > 0){
    //             this.landingTerrain(userData,enter);
    //         }
    //         else{
    //             this.stopRight(userData,enter);
    //         }
    //     }
    // },
});