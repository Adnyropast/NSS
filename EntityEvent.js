
/**
 * Entity events list (with corresponding event objects classes) :
 * defeat
 * - EntityEvent
 * hit
 * - EntityDamageEvent
 * hurt
 * - EntityDamageEvent
 * land
 * - BumpEntityEvent
 * jump
 * - EntityEvent
 * walk
 * - EntityEvent
 * walkstart
 * - EntityEvent
 * walkend
 * - EntityEvent
 * add ??
 * - EntityEvent
 * remove ??
 * - EntityEvent
 * collision ??
 * - EntityEvent
 * drift
 * - EntityEvent
 * swim
 * - EntityEvent
 * climb
 * - EntityEvent
 * crouch
 * - EntityEvent
 * lookup
 * - EntityEvent
 * contactvanish
 * - EntityEvent
 * bump
 * - BumpEntityEvent
 */

// 

class EntityEvent {}

// 

class EntityDamageEvent extends EntityEvent {
    constructor(actor, recipient) {
        super();
        this.actor = actor;
        this.recipient = recipient;
    }
}

// 

class BumpEntityEvent extends EntityEvent {
    constructor(obstacle) {
        super();
        this.obstacle = obstacle;
    }
}

// 
