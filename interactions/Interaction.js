
class Interaction {
    constructor() {
        
    }
}

class CollisionInteraction {
    
}

/**
 *
 */

class InteractionActor {
    constructor() {
        this.actor = null;
        this.recipientClass;
    }
    
    interact(other) {
        return this;
    }
}

class InteractionRecipient {
    constructor() {
        this.recipient = null;
        this.actorClass;
    }
}

/**
 *
 */

class ReplaceActor extends InteractionActor {
    constructor() {
        super();
        this.recipientClass = ReplaceRecipient;
        
        this.replaceId = 0;
    }
    
    interact(other) {
        
        
        return this;
    }
}

class ReplaceRecipient extends InteractionRecipient {
    constructor() {
        super();
        this.actorClass = ReplaceActor;
    }
}

/**
 *
 */

class BrakeActor extends InteractionActor {
    constructor() {
        super();
        this.recipientClass = BrakeRecipient;
        
        this.brakeValue = 1;
    }
    
    interact(other) {
        return this;
    }
}

class BrakeRecipient extends InteractionRecipient {
    constructor() {
        super();
        this.actorClass = BrakeActor;
        
        this.brakeExponent = 1;
    }
}

/**
 *
 */

class DragActor extends InteractionActor {
    constructor() {
        super();
        this.recipientClass = DragRecipient;
        
        this.force = new Vector(0, 0);
        this.vacuum = 0;
    }
    
    interact(other) {
        return this;
    }
}

class DragRecipient extends InteractionRecipient {
    constructor() {
        super();
        this.actorClass = DragActor;
        
        this.forceFactor = 1;
    }
}

/**
 *
 */

class ThrustActor extends InteractionActor {
    constructor() {
        super();
        this.recipientClass = ThrustRecipient;
    }
    
    interact(other) {
        return this;
    }
}

class ThrustRecipient extends InteractionRecipient {
    constructor() {
        super();
        this.actorClass = ThrustActor;
    }
}

/**
 *
 */

class EffectDamager extends InteractionActor {
    constructor() {
        super();
        this.recipientClass = EffectDamageable;
    }
    
    interact(other) {
        return this;
    }
}

class EffectDamageable extends InteractionRecipient {
    constructor() {
        super();
        this.actorClass = EffectDamager;
    }
}
