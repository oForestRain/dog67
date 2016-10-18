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
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    changeToPrefab: function (event) {
        var userData = event.getUserData();
        var target = userData.target;
        var prefabType = userData.prefabType;
        
        console.log("changeToPrefab",target,prefabType);
        
        var particle = this.getPrefab(prefabType);
        particle.position =  target.position;
        particle.parent = target.parent;

        target.destroy();
    },
    
    addPrefab: function (event) {
        console.log("addPrefab");
    },
    
    getPrefab: function (type) {
        if(type >= this.prefabType.length || type >= this.poolArray.length){
            console.log("getPrefab-->undefined");
            return;
        }
        if(!this.prefab[type] || !this.poolArray[type]){
            console.log("getPrefab-->undefined",type);
            return;  
        }

        var instance = null;
        
        if (this.poolArray[type].size() > 0){
            instance = this.poolArray[type].get();
        }
        else{
            instance = cc.instantiate(this.prefab[type]);
        }

        return instance;
    },
    
    putBackPrefab: function (type,instance) {
        if(type >= this.prefabType.length || type >= this.poolArray.length){
            return;
        }
        if(this.prefab[type]===undefined){
            return;  
        }
        this.prefab[type].put(instance);
    }
});
