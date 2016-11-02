var EventType = require("EventType");
var PrefabType = require("PrefabType");

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
        this.poolArray = [];
        var arrLen = this.prefabType.length;
        for(var i = 0; i < arrLen; i++){
            this.poolArray[i] = new cc.NodePool();
        }
        
        var initCount;
        var instance;
        for (i = 0; i < arrLen; i++) {
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
        this.node.on(EventType.insFacChange, 
            function (event) { 
                this.changeToPrefab(event);
            },
            this);
        this.node.on(EventType.insFacAdd, 
            function (event) { 
                this.addPrefab(event);
            },
            this);
        this.node.on(EventType.insFacDel, 
            function (event) { 
                this.putBack(event);
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
        
        // console.log("changeToPrefab",targetType,target,prefabType);
        
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

        // console.log("addPrefab",target,prefabType);
        
        var prefabInstance = this.getPrefab(prefabType);
        prefabInstance.position =  position;
        prefabInstance.parent = target.parent;
        
        // console.log("addPrefab",prefabInstance.position,prefabInstance.parent);
        
    },
    
    putBack: function (event) {
        var userData = event.getUserData();
        var target = userData.target;
        var targetType = userData.type;
        var pool = userData.pool;
        
        // console.log("putBack",targetType,target);
        
        if(pool){
            this.putBackPrefab(targetType,target);
        }
        else{
            target.destroy();
        }
    },
    
    getPrefab: function (type) {
        if(type >= this.prefabType.length || type >= this.poolArray.length){
            // console.log("getPrefab-->undefined");
            return;
        }
        if(!this.prefab[type] || !this.poolArray[type]){
            // console.log("getPrefab-->undefined",type);
            return;  
        }

        console.log("getPrefab-->",this.poolArray[type].size(),type);
        var instance = null;
        
        if (this.poolArray[type].size() > 0){
            instance = this.poolArray[type].get();
        }
        else{
            instance = cc.instantiate(this.prefab[type]);
        }
        console.log("getPrefab-->",this.poolArray[type].size(),type,instance);

        return instance;
    },
    
    putBackPrefab: function (type,instance) {
        if(type >= this.prefabType.length || type >= this.poolArray.length){
            // console.log("putBackPrefab-->undefined");
            return;
        }
        if(this.poolArray[type]===undefined){
            // console.log("putBackPrefab-->undefined",type);
            return;  
        }

        this.poolArray[type].put(instance);
        
        console.log("putBackPrefab-->",this.poolArray[type].size(),type);
    }
});
