var EventType =  cc.Enum({
    //direction or conlliderPart
    dLeft:"DirectionLeft",
    dRight:"DirectionRight",
    dUp:"DirectionUp",
    dDown:"DirectionDown",
    dLU:"DirectionLeftUp",
    dLD:"DirectionLeftDown",
    dRU:"DirectionRightUp",
    dRD:"DirectionRightDown",
    dUL:"DirectionUpLeft",
    dUR:"DirectionUpRight",
    dDL:"DirectionDownLeft",
    dDR:"DirectionDownRight",
    //control
    aMove: "ActorMove",
    aStop: "ActorStop",
    aLock: "ActorLock",
    aLeftEvent: "ActorLeft",
    aRightEvent: "ActorRight",
    aLeftStopEvent: "ActorLeftStop",
    aRightStopEvent: "ActorRightStop",
    aMLeftLockEvent: "ActorMoveLeftLock",
    aMRightLockEvent: "ActorMoveRightLock",
    aJump: "ActorJump",
    aUpLock: "ActorUpLock",
    aJumpLock: "ActorJumpLock",
    aJumpStop: "ActorJumpStop",
    //gravity
    aLanding: "ActorLanding",
    aFallDown: "ActorFallDown",
    //conlliderGroup
    Player : "player",
    Enemy : "enemy",
    Terrain : "terrain",
    Res : "resource",
    //conllider
    aConlliderEnable : "ActorConlliderEnable",
    aConlliderEnter : "ActorConlliderEnter",
    aConlliderStay : "ActorConlliderStay",
    aConlliderExit : "ActorConlliderExit",
    //conlliderEnterArray
    cAddToArray : "ConlliderAddToArray",
    cRemoveFromArray : "ConlliderRemoveFromArray",
    cEnterArrayDisable : "EnterArrayDisable",
    //ObjectInteractEvent
    brickPush : "BrickPush",
    resCollect : "ResCollect",
    //InstanceFactoryEvent
    insFacChange : "InstanceFactoryChange",
    insFacAdd : "InstanceFactoryAdd",
    insFacDel : "InstanceFactoryDelete",
    //PrefabEvent
    prefabReset : "PrefabReset",

});

module.exports = EventType;