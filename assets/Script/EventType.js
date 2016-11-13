var EventType =  cc.Enum({
    //control
    ActorMove: 0,
    ActorMoveStop: 1,
    ActorJump: 2,
    ActorJumpStop: 3,
    ActorMotionLock: 4,
    ActorMotionFree: 5,
    
    //conllider
    ConlliderEnable: 10,
    ConlliderEnter: 11,
    ConlliderStay: 12,
    ConlliderExit: 13,
    
    //gravity
    ActorLanding: 20,
    ActorFalling: 21,
    
    //conlliderEnterArray
    ConlliderAddToArray: 40,
    ConlliderRemoveFromArray: 41,
    EnterArrayDisable: 42,
    
    //InstanceFactoryEvent
    InstanceFactoryChange: 50,
    InstanceFactoryAdd: 51,
    InstanceFactoryDelete: 52,
    
    //ObjectInteractEvent
    ObjectPush : 100,
    ObjectCollect : 101,
    ObjectHit : 102,
    
    //GameInteractEvent
    BrickPush : 200,
    ResourceCollect : 201,
    EnemyHit : 202,
    
    //PlayerInteractEvent
    PlayerDamage : 300,
    PlayerStep : 301,

    //direction or conlliderPart
    // dLeft:"DirectionLeft",
    // dRight:"DirectionRight",
    // dUp:"DirectionUp",
    // dDown:"DirectionDown",
    // dLU:"DirectionLeftUp",
    // dLD:"DirectionLeftDown",
    // dRU:"DirectionRightUp",
    // dRD:"DirectionRightDown",
    // dUL:"DirectionUpLeft",
    // dUR:"DirectionUpRight",
    // dDL:"DirectionDownLeft",
    // dDR:"DirectionDownRight",
    // //control
    // // aMove: "ActorMove",
    // // aStop: "ActorStop",
    // // aLock: "ActorLock",
    // aLeftEvent: "ActorLeft",
    // aRightEvent: "ActorRight",
    // aLeftStopEvent: "ActorLeftStop",
    // aRightStopEvent: "ActorRightStop",
    // aMLeftLockEvent: "ActorMoveLeftLock",
    // aMRightLockEvent: "ActorMoveRightLock",
    // // aJump: "ActorJump",
    // aUpLock: "ActorUpLock",
    // // aJumpLock: "ActorJumpLock",
    // // aJumpStop: "ActorJumpStop",
    // //gravity
    // // aLanding: "ActorLanding",
    // // aFallDown: "ActorFallDown",
    // //conlliderGroup
    // // Player : "player",
    // // Enemy : "enemy",
    // // Terrain : "terrain",
    // // Res : "resource",
    // //conllider
    // aConlliderEnable : "ActorConlliderEnable",
    // aConlliderEnter : "ActorConlliderEnter",
    // aConlliderStay : "ActorConlliderStay",
    // aConlliderExit : "ActorConlliderExit",
    // //conlliderEnterArray
    // cAddToArray : "ConlliderAddToArray",
    // cRemoveFromArray : "ConlliderRemoveFromArray",
    // cEnterArrayDisable : "EnterArrayDisable",
    //ObjectInteractEvent
    // brickPush : "BrickPush",
    // resCollect : "ResCollect",
    // //InstanceFactoryEvent
    // insFacChange : "InstanceFactoryChange",
    // insFacAdd : "InstanceFactoryAdd",
    // insFacDel : "InstanceFactoryDelete",
    //PrefabEvent
    // prefabReset : "PrefabReset",

});

module.exports = EventType;