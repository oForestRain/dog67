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
        activeOnEnable: true,
    },

    // use this for initialization
    onLoad: function () {
        this.initListener();

        this.lockArray = [];
        
        this.enable = false;
     },
    
    onEnable: function () {
        this.lockArray.length = 0;

        this.enable = this.activeOnEnable;
    },
    
    onDisable: function () {

    },
    
    //conllider
    // ConlliderEnable: 10,
    // ConlliderEnter: 11,
    // ConlliderStay: 12,
    // ConlliderExit: 13,

    initListener : function(){
        this.node.on(EventType.MotionColliderHandlerEnable, 
            function (event) {
                this.componentEnable(event);
            },
            this);
        this.node.on(EventType.ConlliderEnter, 
            function (event) {
                console.log("MotionColliderHandler-->ConlliderEnter");
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
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    componentEnable : function( event ){
        
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
        if(this.enable!==true){
            return;
        }
        
        var userData = event.getUserData();
        var direction = userData.direction;
        var other = userData.other.node;
        this.enterAt(direction,other);
        
        this.colliderCheck(direction);
        this.backToPosition(direction, userData);

        // console.log("MotionColliderHandler-->enterHandler");
    },
    
    exitHandler : function( event ){
        // console.log("MotionColliderHandler-->exitHandler");
        var userData = event.getUserData();
        var other = userData.other.node;
        var tangent  = userData.tangent;

        var direction = this.exitFrom(other,!tangent);
        
        if(direction){
            this.colliderCheck(direction);
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
    
    exitFrom : function( other , clearAll ){
        // console.log("MotionColliderHandler-->exitFrom",other.group,clearAll);
        
        var direction;
        var kArray;
        for(var key in this.lockArray){
            // console.log("MotionColliderHandler-->exitFrom key",key,this.lockArray.length);
            kArray = this.lockArray[key];
            for(var j in kArray){
                if(kArray[j]===other){
                    // console.log("MotionColliderHandler-->exitFrom j1",key,j,kArray.length);
                    direction = key;
                    if(clearAll===false){
                        kArray.splice(j,1);
                    }
                    else{
                        kArray.length = 0;
                    }
                    // console.log("MotionColliderHandler-->exitFrom j2",key,j,kArray.length,kArray[j]);
                    return direction;
                }
            }
        }
        
        return direction;
    },
    
    colliderCheck: function( direction ){
        // if(ColliderGroupMapping[userData.actor.node.group]== ColliderGroupEnum.Enemy){
        //     console.log("MotionColliderHandler-->colliderCheck",direction);
        // }
        var kArray;
        if(!this.lockArray[direction]){
            this.lockArray[direction] = [];
        }
        kArray = this.lockArray[direction];

        // console.log("MotionColliderHandler-->colliderCheck",direction,kArray,kArray.length);
        
        var event;
        var data = {};
        var bool = kArray.length>0;
        if(direction==DirectionType.Up){
                if(bool){
                    event = new cc.Event.EventCustom(EventType.ActorMotionLock, true );
                    data.direction = direction;
                    data.bool = bool;
                }
        }
        else if(direction==DirectionType.Down){
                event = new cc.Event.EventCustom(EventType.ActorMotionLock, true );
                data.direction = direction;
                data.bool = bool;
                // console.log("MotionColliderHandler-->dispatchEventDown",data.bool);
        }
        else if(direction==DirectionType.Left || direction==DirectionType.Right){
                event = new cc.Event.EventCustom(EventType.ActorMotionLock, true );
                data.direction = direction;
                data.bool = bool;
                // console.log("MotionColliderHandler-->dispatchEventLeftRight",data.bool,kArray.length);
        }
            
        if(event){
            event.setUserData(data);
            this.dispatchLockEvent( event );
        }
    },
    
    dispatchLockEvent : function(event){
        if(event){
            this.node.dispatchEvent( event );
        }
        
        var lockcount = 0;
        for(var kArray in this.lockArray){
            lockcount +=kArray.length;
        }
        if(lockcount){
            this.node.color = cc.Color.RED;
        }
        else{
            this.node.color = cc.Color.WHITE;
        }
    },

    backToPosition:function(direction,userData){
        var other = userData.other;
        var actor = userData.actor;
        var otherAabb = other.world.aabb;
        var actorAabb = actor.world.aabb;
        
        pos = new cc.Vec2(actor.node.x,other.node.position - otherAabb.height*.5 - actorAabb.height*.5 - 1);
        
        var pos;
        if(direction==DirectionType.Up){
            pos = new cc.Vec2(actorAabb.center.x,otherAabb.yMin - actorAabb.height*.5 - 1);
        }
        else if(direction==DirectionType.Down){
            pos = new cc.Vec2(actorAabb.center.x,otherAabb.yMax + actorAabb.height*.5);
        }
        else if(direction == DirectionType.Left){
            pos = new cc.Vec2(otherAabb.xMax + actorAabb.width*.5,actorAabb.center.y);
        }
        else if(direction == DirectionType.Right){
            pos = new cc.Vec2(otherAabb.xMin - actorAabb.width*.5,actorAabb.center.y);
        }
        
        // console.log("MotionColliderHandler1",this.node.position);
        // console.log("MotionColliderHandler2",actorAabb.center);
        // console.log("MotionColliderHandler3",actor.node.position);

        this.node.position =  this.node.parent.convertToNodeSpaceAR(pos);
        // console.log("MotionColliderHandler-1",this.node.position);
        // console.log("MotionColliderHandler4",this.node.parent.convertToNodeSpace(pos));
        // console.log("MotionColliderHandler5",this.node.parent.position);
        // console.log("MotionColliderHandler6",this.node.parent.width,this.node.parent.height);
        // console.log("MotionColliderHandler6",cc.js.getClassName(this.node.parent),this.node.parent.name,this.node.parent.position);
         
        
    },
    
    stayHandler : function( event ){
        if(this.enable!==true){
            return;
        }
    },
});