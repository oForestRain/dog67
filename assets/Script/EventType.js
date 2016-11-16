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
});

module.exports = EventType;