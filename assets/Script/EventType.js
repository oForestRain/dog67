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
    
    //autoMove
    AutoMoveReverse:30,
    AutoMoveComplete:31,
    
    //componentEnable
    MotionColliderHandlerEnable:40,
    CameraFollowEnable:41,
    GravityEnable:42,
    AutoMoveEnable:43,
    InputControllerEnable:44,
    
    //componentTarget
    CameraFollowTarget:50,
    InputControllerTarget:51,
    
    //instanceFactory
    InstanceFactoryChange: 60,
    InstanceFactoryAdd: 61,
    InstanceFactoryDelete: 62,
    InstancePlayerGet: 63,
    InstancePlayerPut: 64,
    InstanceUIGet: 65,
    InstanceUIPut: 66,
    
    //sceneEvent
    GameLoadingScene: 70,
    LoadingUIComplete:71,
    LoadingScene:72,
    SceneLoadingComplete: 73,
    EnterScene: 74,
    SceneEnterComplete: 75,

    //camera

    //objectInteractEvent
    ObjectPush : 100,
    ObjectCollect : 101,
    ObjectHit : 102,
    
    //gameInteractEvent
    BrickPush : 200,
    ResourceCollect : 201,
    EnemyHit : 202,
    
    //playerInteractEvent
    PlayerDamage : 300,
    PlayerStep : 301,
    
    //emitterParameterEvent
    EmitterParameterEmit : 400,
    EmitterParameter1 : 401,
    EmitterParameter2 : 402,
});

module.exports = EventType;