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
        
        this.enterArray = [];
    },
    
    onEnable: function () {
        // console.log("CAHonEnable--->");
        this.enterArray.length = 0;
    },
    
    onDisable: function () {
        // console.log("CAHonDisable--->");
        
        this.dispatchAllArray();
    },
    
    // //conlliderEnterArray
    // cAddToArray : "ConlliderAddToArray",
    // cRemoveFromArray : "ConlliderRemoveFromArray",
    
    initListener : function(){
        this.node.on(EventType.cAddToArray, 
            function (event) {
                this.addToArray(event);
            },
            this);
        this.node.on(EventType.cRemoveFromArray, 
            function (event) {
                this.removeFromArray(event);
            },
            this);
    },

    addToArray : function( event ){
        var userData = event.getUserData();
        var actor = userData.actor;
        this.enterArray.push(actor);
        
        // console.log("CAHaddToArray--->",actor,actor.group);
    },
    
    removeFromArray : function( event ){
        var userData = event.getUserData();
        var actor = userData.actor;

        for(var i=0;i<this.enterArray.length;i++){
            if(this.enterArray[i]==actor){
                this.enterArray.splice(i,1);
                // console.log("CAHremoveFromArray-->i",i);
                break;
            }
        }
    },
    
    dispatchAllArray : function( ){

        // console.log("CAHdispatchAllArray--->",this.enterArray.length);
        
        var event;
        var actor;
        var userData;
        for(var i=0;i<this.enterArray.length;i++){
            actor = this.enterArray[i];
            event = new cc.Event.EventCustom(EventType.cEnterArrayDisable, true );
            userData = {};
            userData.other = this.node;
            // console.log("CAHdispatchAllArray--->",i,userData.other.group,actor.group);
            actor.dispatchEvent(event);
        }
        
        this.enterArray.length = 0;
        // console.log("CAHdispatchAllArray--->",this.enterArray[0]);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
