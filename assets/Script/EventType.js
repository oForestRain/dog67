var EventType =  cc.Enum({
    //control
    aLeftEvent: "ActorLeft",
    aRightEvent: "ActorRight",
    aLeftStopEvent: "ActorLeftStop",
    aRightStopEvent: "ActorRightStop",
    aMLeftLockEvent: "ActorMoveLeftLock",
    aMRightLockEvent: "ActorMoveRightLock",
    aJumpEvent: "ActorJump",
    aUpLockEvent: "ActorUpLock",
    aJumpLockEvent: "ActorJumpLock",
    aJumpStopEvent: "ActorJumpStop",
    //gravity
    aLandingEvent: "ActorLanding",
    aFallDownEvent: "ActorFallDown",
    //conlliderGroup
    Player : "player",
    Enemy : "enemy",
    Terrain : "terrain",
    //conllider
    aConlliderEnter : "ActorConlliderEnter",
    aConlliderStay : "ActorConlliderStay",
    aConlliderExit : "ActorConlliderExit",
    //conlliderPart
    cPartLeft : "ConlliderPartLeft",
    cPartRight : "ConlliderPartRight",
    cPartTop : "ConlliderPartTop",
    cPartBottom : "ConlliderPartBottom",
    cPartLeftTop : "ConlliderPartLeftTop",
    cPartLeftBottom : "ConlliderPartLeftBottom",
    cPartRightTop : "ConlliderPartRightTop",
    cPartRightBottom : "ConlliderPartRightBottom",
    cPartTopLeft : "ConlliderPartTopLeft",
    cPartTopRight : "ConlliderPartTopRight",
    cPartBottomLeft : "ConlliderPartBottomLeft",
    cPartBottomRight : "ConlliderPartBottomRight",
    //ObjectInteractEvent
    insFacChange : "instanceFactoryChange",
    insFacAdd : "instanceFactoryAdd",
    
});

module.exports = EventType;