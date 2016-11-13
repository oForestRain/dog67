var EventType = require("EventType");
var ColliderGroupMapping = require("ColliderGroupMapping");
var ColliderGroupEnum = require("ColliderGroupEnum");
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
        colliderOnEnable: true,
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();

        this.lockArray = [];
        
        this.enable = false;
     },
    
    onEnable: function () {
        this.lockArray.length = 0;

        this.enable = this.colliderOnEnable;
    },
    
    onDisable: function () {

    },
    
    //conllider
    // ConlliderEnable: 10,
    // ConlliderEnter: 11,
    // ConlliderStay: 12,
    // ConlliderExit: 13,

    initListener : function(){
        this.node.on(EventType.ConlliderEnable, 
            function (event) {
                this.conlliderEnable(event);
            },
            this);
        this.node.on(EventType.ConlliderEnter, 
            function (event) {
                // console.log("MotionColliderHandler-->ConlliderEnter");
                if(this.checkGroup(event)){
                    this.enterHandler(event);
                }
            },
            this);
        this.node.on(EventType.ConlliderStay, 
            function (event) {
                this.stayHandler(event);
            },
            this);
        this.node.on(EventType.ConlliderExit, 
            function (event) {
                // console.log("MotionColliderHandler-->ConlliderExit");
                if(this.checkGroup(event)){
                    this.exitHandler(event);
                }
            },
            this);
        this.node.on(EventType.EnterArrayDisable, 
            function (event) {
                this.exitFromDisable(event);
            },
            this);
        this.node.on(EventType.ActorMotionFree, 
            function (event) {
                this.motionFree(event);
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
    
    //ColliderGroup
    // Player: 0,
    // Enemy: 1,
    // Terrain: 2,
    // Res: 3,
    
    enterHandler : function( event ){
        // console.log("MotionColliderHandler-->enterHandler",this.enable);
        if(!this.enable){
            return;
        }
        
        var userData = event.getUserData();
        this.enterCheckBorder(userData);

        var lockcount = 0;
        for(var kArray in this.lockArray){
            lockcount +=kArray.length;
        }
        if(lockcount){
            this.node.color = cc.Color.RED;
        }
        // console.log("MotionColliderHandler-->enterHandler",this.leftLockCount,this.rightLockCount,this.upLockCount,this.downLockCount);
    },
    
    exitHandler : function( event ){
        // console.log("MotionColliderHandler-->exitHandler");
        var userData = event.getUserData();
        var other = userData.other.node;
        
        var direction = this.exitFrom(other);
        
        if(direction){
             this.colliderCheck(direction,userData);
        }
        
        var lockcount = 0;
        for(var kArray in this.lockArray){
            lockcount +=kArray.length;
        }
        if(lockcount){
            this.node.color = cc.Color.WHITE;
        }
    },
    
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
    
    checkGroup:function(event){
        var userData = event.getUserData();
        
        var actorEnum = ColliderGroupMapping[userData.actor.node.group];
        var otherEnum = ColliderGroupMapping[userData.other.node.group];
        if(actorEnum===undefined || otherEnum===undefined){
            return false;
        }
        
        if(actorEnum == ColliderGroupEnum.Player && otherEnum == ColliderGroupEnum.Terrain ||
            actorEnum == ColliderGroupEnum.Enemy && otherEnum == ColliderGroupEnum.Terrain ||
            actorEnum == ColliderGroupEnum.Resource && otherEnum == ColliderGroupEnum.Terrain){
            return true;
        }

        return false;
    },

    enterCheckBorder : function(userData){
        var direction = userData.direction;
        var other = userData.other.node;

        this.enterAt(direction,other);
        this.colliderCheck(direction,userData);
    },
    
    //conlliderEnterArray
    // ConlliderAddToArray: 40,
    // ConlliderRemoveFromArray: 41,
    // EnterArrayDisable: 42,
    
    enterAt : function(direction,other){
        var lArray;
        if(!this.lockArray[direction]){
            this.lockArray[direction] = [];
        }
        lArray = this.lockArray[direction];
        lArray.push(other);
        
        var event = new cc.Event.EventCustom(EventType.ConlliderAddToArray, true );
        var data = {};
        data.actor = this.node;
        data.other = other;
        event.setUserData(data);
        other.dispatchEvent( event );
        
        // console.log("enterAt-->",direction,this.lockArray[direction].length,other.group);
    },
    
    exitFrom : function( other ){
        // console.log("MotionColliderHandler-->exitFrom",other.group);
        var event = new cc.Event.EventCustom(EventType.ConlliderRemoveFromArray, true );
        var data = {};
        data.actor = this.node;
        event.setUserData(data);
        other.dispatchEvent(event);
        
        var direction;
        var kArray;
        for(var key in this.lockArray){
            // console.log("MotionColliderHandler-->exitFrom key",key,this.lockArray.length);
            kArray = this.lockArray[key];
            for(var j in kArray){
                if(kArray[j]===other){
                    // console.log("MotionColliderHandler-->exitFrom j1",key,j,kArray.length);
                    direction = key;
                    kArray.splice(j,1);
                    // console.log("MotionColliderHandler-->exitFrom j2",key,j,kArray.length,kArray[j]);
                    return direction;
                }
            }
        }
        
        return direction;
    },
    
    exitFromDisable : function( other ){
        // console.log("MotionColliderHandler-->exitFromDisable",other.group);
        var direction;
        var kArray;
        for(var key in this.lockArray){
            kArray = this.lockArray[key];
            for(var j in kArray){
                if(kArray[j]===other){
                    // console.log("MotionColliderHandler-->exitFromDisable-->j1",key,j,kArray.length);
                    direction = key;
                    kArray.splice(j,1);
                    // console.log("MotionColliderHandler-->exitFromDisable-->j2",key,j,kArray.length,kArray[j]);
                    return direction;
                }
            }
        }
        
        return direction;
    },
    
    colliderCheck: function( direction , userData ){
        // console.log("MotionColliderHandler-->colliderCheck",direction);
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
        
        // console.log("MotionColliderHandler-->colliderCheck",direction,kArray,kArray.length);
        
        var event;
        var data;
        if(direction==DirectionType.Up){
                if(kArray.length>0){
                    event = new cc.Event.EventCustom(EventType.ActorMotionLock, true );
                    data = {};
                    data.direction = direction;
                    data.bool = (kArray.length>0);
                    event.setUserData(data);
                    this.node.y = otherAabb.yMin - actorAabb.height*.5 - 1;
                }
                // console.log("MotionColliderHandler-->dispatchEventUp");
        }
        else if(direction==DirectionType.Down){
                if(kArray.length>0){
                    event = new cc.Event.EventCustom(EventType.ActorLanding, true );
                    this.node.y = otherAabb.yMax + actorAabb.height*.5;
                }
                else{
                    event = new cc.Event.EventCustom(EventType.ActorFalling, true );
                }
                // console.log("MotionColliderHandler-->dispatchEventDown",kArray.length);
        }
        else if(direction==DirectionType.Left || direction==DirectionType.Right){
                event = new cc.Event.EventCustom(EventType.ActorMotionLock, true );
                data = {};
                data.direction = direction;
                data.bool = (kArray.length>0);
                event.setUserData(data);
                if(data.bool){
                    if(direction == DirectionType.Left){
                        this.node.x = otherAabb.xMax + actorAabb.width*.5
                    }
                    else{
                        this.node.x = otherAabb.xMin - actorAabb.width*.5;
                    }
                }
                // console.log("MotionColliderHandler-->dispatchEventLeftRight",data.bool,kArray.length);
        }
        
        if(event){
            this.node.dispatchEvent( event );
        }
    },
    
    motionFree : function( event ){
        // console.log("MotionColliderHandler-->motionFree");
        var userData = event.getUserData();
        var direction = userData.direction;
        
        if(!this.lockArray[direction]){
            return;
        }
        
        // console.log("MotionColliderHandler-->motionFree",direction);

        var kArray = this.lockArray[direction];
        kArray.length = 0;
        
        this.colliderCheck(direction,null);
    },
    
    stayHandler : function( event ){
        if(!this.enable){
            return;
        }
    },
});