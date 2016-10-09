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
        prefabArray:[cc.Prefab],
        preInstantiate:[cc.Integer],
    },

    // use this for initialization
    onLoad: function () {
        this.poolArray = [];
        var arrLen = this.prefabArray.length;
        for(var i = 0; i < arrLen; i++){
            this.poolArray[i] = new cc.NodePool();
        }
        
        var initCount;
        var instance;
        for (i = 0; i < arrLen; i++) {
            if(this.preInstantiate[i]>0){
                if(this.prefabArray[i]){
                    instance = cc.instantiate(this.prefabArray[i]);
                    this.poolArray[i].put(instance);
                }
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    getPrefab: function (type) {
        if(type >= this.prefabArray.length || type >= this.poolArray.length){
            return;
        }
        if(!this.prefabArray[type] || !this.poolArray[type]){
            console.log("getPrefab-->undefined",type);
            return;  
        }

        var instance = null;
        
        if (this.poolArray[type].size() > 0){
            instance = this.poolArray[type].get();
        }
        else{
            instance = cc.instantiate(this.prefabArray[type]);
        }

        return instance;
    },
    
    putBackPrefab: function (type,instance) {
        if(type >= this.prefabArray.length || type >= this.poolArray.length){
            return;
        }
        if(this.poolArray[type]===undefined){
            return;  
        }
        this.poolArray[type].put(instance);
    }
});
