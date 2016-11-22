var EventType = require("EventType");
var PrefabType = require("PrefabType");
var GlobalReference = require("GlobalReference");

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
        prefabType:{
            default : [],
            type: [PrefabType],
        },
        prefab:[cc.Prefab],
        preInstanceNum:[cc.Integer],
    },
    
    // use this for initialization
    onLoad: function () {
        // console.log("InstanceFactory-->onLoad");
        this.poolArray = [];
        var arrLen = this.prefabType.length;
        for(var i = 0; i < arrLen; i++){
            this.poolArray[i] = new cc.NodePool();
        }
        
        var initCount;
        var instance;
        for(i = 0; i < arrLen; i++) {
            if(this.preInstanceNum[i]>0){
                if(this.prefab[i]){
                    instance = cc.instantiate(this.prefab[i]);
                    this.poolArray[i].put(instance);
                }
            }
        }
        
        this.initListener();
    },
    
    initListener : function(){
        this.node.on(EventType.InstanceFactoryChange, 
            function (event) { 
                this.changeToPrefab(event);
            },
            this);
        this.node.on(EventType.InstanceFactoryAdd, 
            function (event) { 
                this.addPrefab(event);
            },
            this);
        this.node.on(EventType.InstanceFactoryDelete, 
            function (event) { 
                this.putBack(event);
            },
            this);
        this.node.on(EventType.InstancePlayerGet, 
            function (event) { 
                this.getPlayer(event);
            },
            this);
        this.node.on(EventType.InstancePlayerPut, 
            function (event) { 
                this.putPlayer(event);
            },
            this);
    },
    
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    changeToPrefab: function (event) {
        var userData = event.getUserData();
        var target = userData.target;
        var targetType = userData.type;
        var prefabType = userData.prefabType;
        var pool = userData.pool;
        
        console.log("InstanceFactory-->changeToPrefab",targetType,target,prefabType,target.position);
        
        var prefabInstance = this.getPrefab(prefabType);
        prefabInstance.position =  target.position;
        prefabInstance.parent = target.parent;

        if(pool){
            this.putBackPrefab(targetType,target);
        }
        else{
            target.destroy();
        }
    },
    
    addPrefab: function (event) {
        var userData = event.getUserData();
        var target = userData.target;
        var prefabType = userData.prefabType;
        var position = userData.position;

        console.log("InstanceFactory-->addPrefab",target,prefabType,position);
        
        var prefabInstance = this.getPrefab(prefabType);
        prefabInstance.position =  position;
        prefabInstance.parent = target.parent;
        
        // console.log("InstanceFactory-->addPrefab",prefabInstance.position,prefabInstance.parent);
    },
    
    putBack: function (event) {
        var userData = event.getUserData();
        var target = userData.target;
        var targetType = userData.type;
        var pool = userData.pool;
        
        console.log("InstanceFactory-->putBack",targetType,target);
        
        if(pool){
            this.putBackPrefab(targetType,target);
        }
        else{
            target.destroy();
        }
    },
    
    getPrefab: function (type) {
        if(type >= this.prefabType.length || type >= this.poolArray.length){
            // console.log("InstanceFactory-->getPrefab undefined");
            return;
        }
        if(!this.prefab[type] || !this.poolArray[type]){
            // console.log("InstanceFactory-->getPrefab undefined",type);
            return;  
        }

        // console.log("InstanceFactory-->getPrefab",this.poolArray[type].size(),type);
        var instance = null;
        
        if (this.poolArray[type].size() > 0){
            instance = this.poolArray[type].get();
        }
        else{
            instance = cc.instantiate(this.prefab[type]);
        }
        // console.log("InstanceFactory-->getPrefab",this.poolArray[type].size(),type,instance);

        return instance;
    },
    
    putBackPrefab: function (type,instance) {
        if(type >= this.prefabType.length || type >= this.poolArray.length){
            // console.log("InstanceFactory-->putBackPrefab undefined");
            return;
        }
        if(this.poolArray[type]===undefined){
            // console.log("InstanceFactory-->putBackPrefab undefined",type);
            return;  
        }

        this.poolArray[type].put(instance);
        
        // console.log("InstanceFactory-->putBackPrefab",this.poolArray[type].size(),type,instance);
    },

    getPlayer: function (event) {
        console.log("InstanceFactory-->getPlayer");
        var userData = event.getUserData();
        var initData = userData.initData;
        var parent = userData.parent;
        var prefabType = PrefabType.Player;
        var position = new cc.Vec2(0,0);
        var callback = userData.callback;
        var delegate = userData.delegate;

        // console.log("InstanceFactory-->getPlayer",parent,prefabType,position);
        
        var prefabInstance = this.getPrefab(prefabType);
        prefabInstance.position = position;
        prefabInstance.parent = parent;
        
        // console.log("InstanceFactory-->getPlayer",prefabInstance.position,prefabInstance.parent);
        callback(delegate,prefabInstance);
        // console.log("InstanceFactory-->getPlayer");
    },
    
    putPlayer: function (event) {
        var target = GlobalReference.PlayerInstance;
        var targetType = PrefabType.Player;
        var pool = true;
        
        // console.log("InstanceFactory-->putPlayer",targetType,target,pool);
        
        if(pool){
            this.putBackPrefab(targetType,target);
        }
        else{
            target.destroy();
        }
    },
});
