"use strict";
cc._RFpush(module, 'f9c393dO3VLaoReU2BeDu3k', 'StateType');
// Script\StateType.js

var StateType = {
    aIdle: "ActorIdle",
    //move
    aMovingLeft: "ActorMovingLeft",
    aMovingRight: "ActorMovingRight",
    aMoveToStop: "ActorMoveToStop",
    //jump
    aJump: "ActorJump",
    aJump2: "ActorJump2",
    aFallDown: "ActorFallDown",
    aLanding: "ActorLanding"
};

module.exports = StateType;

cc._RFpop();