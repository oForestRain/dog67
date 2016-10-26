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
        upHeight : 65,
        speed : 65,
    },

    // use this for initialization
    onLoad: function () {
        this.startUp = false;
    },
    
    onEnable: function () {
        this.startUp = true;
        this.yOffset = 0;
    },
    
    onDisable: function () {

    },
    

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.startUp){
            var offsetY = this.speed * dt;
            this.yOffset += offsetY;
            if(this.yOffset>=this.upHeight){
                offsetY = offsetY - this.yOffset + this.upHeight;
                this.startUp = false;
                var event = new cc.Event.EventCustom(EventType.aFallDownEvent, true );
                this.node.dispatchEvent( event );
                event = new cc.Event.EventCustom(EventType.aConlliderEnable, true );
                var userData = {};
                userData.enable = true;
                event.setUserData(userData);
                this.node.dispatchEvent( event );
            }
            this.node.y += offsetY;
        }
    },
});
