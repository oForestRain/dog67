var EventType = require("EventType");
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
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    selectScene:function(event,sceneName){
        console.log("SceneSelect--->selectScene",sceneName,GlobalReference.GameInstance);

        event = new cc.Event.EventCustom(EventType.GameLoadingScene, true );
        var userData={};
        userData.sceneName = sceneName;
        event.setUserData(userData);
        GlobalReference.GameInstance.dispatchEvent(event);
    },
});
