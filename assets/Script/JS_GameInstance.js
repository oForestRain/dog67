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

        controller : {
            default: null,
            type: cc.Node
        },
        
        insFactory : {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    
    start: function () {
        GlobalReference.GameInstanceComponent = this;
        GlobalReference.GameController  = this.controller;
        GlobalReference.InstanceFactory  = this.insFactory;
        
        cc.director.setDisplayStats(true);
        
        cc.game.addPersistRootNode(this.node);
        // removePersistRootNode
        //  console.log("JS_GameInstance.isPersistRootNode--->",cc.game.isPersistRootNode(this.node));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
