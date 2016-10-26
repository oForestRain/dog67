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
        upHeight : 64,
        speed : 64,
    },

    // use this for initialization
    onLoad: function () {
        this.startUp = false;
    },
    
    start: function () {
        this.startUp = true;
        this.yOffset = 0;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.startUp){
            var offsetY = this.speed * dt;
            this.yOffset += offsetY;
            if(this.yOffset>=this.upHeight){
                offsetY = offsetY - this.yOffset + this.upHeight;
                this.startUp = false;
            }
            this.node.y += offsetY;
        }
    },
});
