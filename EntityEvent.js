
// 

class EntityEvent {}

// 

class EntityDefeatEvent extends EntityEvent {}

EntityEvent["defeat"] = EntityDefeatEvent;

// 

class EntityDamageEvent extends EntityEvent {
    constructor(actor, recipient) {
        super();
        this.actor = actor;
        this.recipient = recipient;
    }
}

EntityEvent["hit"] = EntityDamageEvent;

// 

EntityEvent["hurt"] = EntityDamageEvent;

// 

class EntityLandEvent extends EntityEvent {
    constructor(obstacle) {
        super();
        this.obstacle = obstacle;
    }
}

EntityEvent["land"] = EntityLandEvent;

// 

EntityEvent["jump"] = EntityEvent;

// 

EntityEvent["walk"] = EntityEvent;

// 

EntityEvent["walkstart"] = EntityEvent;

// 

EntityEvent["walkend"] = EntityEvent;

// ??

EntityEvent["add"] = EntityEvent;

// ??

EntityEvent["remove"] = EntityEvent;

// ??

EntityEvent["collision"] = EntityEvent;

// 

EntityEvent["drift"] = EntityEvent;
EntityEvent["swim"] = EntityEvent;
EntityEvent["climb"] = EntityEvent;

// 

EntityEvent["crouch"] = EntityEvent;
EntityEvent["lookup"] = EntityEvent;

// 