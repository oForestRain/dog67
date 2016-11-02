var GlobalReference = require("GlobalReference");
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
        type: {
            default:PrefabType.boneRes,
            type:PrefabType,
        },
        pool:true,
    },

    // use this for initialization
    onLoad: function () {

        this.initListener();

    },
    
    initListener : function(){
        this.node.on(EventType.aConlliderEnter, 
            function (event) { 
                this.enterHandler(event);
            },
            this);
      },
    
    enterHandler : function( event ){
        var userData = event.getUserData();
        // console.log("enterHandler-->",userData.other.node.group);

        // if(userData === null || userData.other === null || userData.other.node === null){
            // return;
        // }

        switch(userData.other.node.group){
            // case EventType.Enemy:
            case EventType.Player:
                this.collect();
                break;
        }
        
        // console.log("enterHandler-->");
    },

    collect: function (dt) {
        // console.log("collect--->",this.type);

        var event = new cc.Event.EventCustom(EventType.resCollect , true);
        
        var userData = {};
        userData.target = this.node;
        userData.type = this.type;
        userData.pool = this.pool;
        event.setUserData(userData);
        
        // console.log("pushed--->",userData.target,userData.prefabType);
        
        GlobalReference.GameInstance.dispatchEvent(event);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});