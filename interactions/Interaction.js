
/**

class Interaction {
    constructor() {
        
    }
}

class CollisionInteraction {
    
}

/**
 *
 */

class Interactor {
    constructor() {
        this.id = -1;
        this.actor = null;
    }
    
    matchId(id) {return this.id == id;}
    getId() {return this.id;}
    setId(id) {this.id = id; return this;}
    
    getActor() {return this.actor;}
    setActor(actor) {this.actor = actor; return this;}
    
    interact(interrecipient) {
        return this;
    }
    
    interactDimension(interrecipient, dimension) {
        return this;
    }
}

class Interrecipient {
    constructor() {
        this.id = -1;
        this.recipient = null;
    }
    
    matchId(id) {return this.id == id;}
    getId() {return this.id;}
    setId(id) {this.id = id; return this;}
    
    getRecipient() {return this.recipient;}
    setRecipient(recipient) {this.recipient = recipient; return this;}
    
    oninteraction(interactor) {
        return this;
    }
}

/**
 *
 */

class ReplaceActor extends Interactor {
    constructor(replaceId = 0, bounce = 0) {
        super();
        this.setId("replace");
        
        this.replaceId = replaceId;
        this.bounce = bounce;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        
        
        
        return this;
    }
}

class ReplaceRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("replace");
    }
}

/**
 *
 */

class BrakeActor extends Interactor {
    constructor(brakeValue = 1) {
        super();
        this.setId("brake");
        
        this.brakeValue = brakeValue;
    }
    
    interact(interrecipient) {
        var recipient = interrecipient.getRecipient();
        
        for(var dim = 0; dim < recipient.getDimension(); ++dim) {
            recipient.speed[dim] /= interrecipient.negotiateBrake(this.brakeValue);
            
            if(isAlmostZero(recipient.speed[dim])) {
                recipient.speed[dim] = 0;
            }
        }
        
        return this;
    }
}

class BrakeRecipient extends Interrecipient {
    constructor(brakeExponent = 1) {
        super();
        this.setId("brake");
        
        this.brakeExponent = brakeExponent;
    }
    
    negotiateBrake(brakeValue) {
        return Math.pow(brakeValue, this.brakeExponent)
    }
}

/**
 *
 */

class DragActor extends Interactor {
    constructor(force = new Vector(0, 0)) {
        super();
        this.setId("drag");
        
        this.force = force;
    }
    
    interact(interrecipient) {
        return this;
    }
}

class VacuumDragActor extends Interactor {
    constructor(vacuum = 0) {
        super();
        this.setId("drag");
        
        this.vacuum = vacuum;
    }
}

class DragRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("drag");
        
        this.forceFactor = 1;
    }
}

/**
 *
 */

class ThrustActor extends Interactor {
    constructor(thrustValue = 0) {
        super();
        this.setId("thrust");
        
        this.thrustValue = thrustValue;
    }
    
    interact(interrecipient) {
        return this;
    }
}

class ThrustRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("thrust");
    }
}

/**
 *
 */

class EffectDamager extends Interactor {
    constructor(offenses = [{"type" : "example", "value" : 0}]) {
        super();
        this.setId("damage");
        
        this.offenses = offenses;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        for(var i = 0; i < this.offenses.length; ++i) {
            var type = this.offenses[i].type;
            
            recipient.hurt(interrecipient.negotiateDamage(type, this.offenses[i].value));
        }
        
        return this;
    }
}

class EffectDamageable extends Interrecipient {
    constructor(factors = [{"type" : "example", "value" : 1}]) {
        super();
        this.setId("damage");
        
        this.factors = factors;
    }
    
    negotiateDamage(type, damage) {
        for(var i = 0; i < this.factors.length; ++i) {
            if(this.factors[i].type == type) {
                return this.factors[i].value * damage;
            }
        }
        
        return damage;
    }
}

/**
 *
 */

class GroundActor extends Interactor {
    constructor() {
        super();
        this.setId("ground");
    }
    
    
}

class GroundRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("ground");
        
        this.grounded = false;
    }
}

/**
 *
 */

class ItemPicker extends Interactor {
    constructor() {
        super();
        this.setId("itemPick");
        
        this.items = [];
    }
    
    interact(interrecipient) {
        this.items.push(interrecipient.item);
        interrecipient.item = null;
        
        return this;
    }
}

class ItemPickable extends Interrecipient {
    constructor(item) {
        super();
        this.setId("itemPick");
        
        this.item;
    }
    
    oninteraction(interactor) {
        removeEntity(this.getRecipient());
        
        return this;
    }
}

/**
 *
 */

class MapWarper extends Interactor {
    constructor(mapname) {
        super();
        this.setId("mapwarp");
        
        this.mapname = mapname;
    }
    
    interact(interrecipient) {
        
        removeEntity(interrecipient.getRecipient());
        
        return this;
    }
}

class MapWarpable extends Interrecipient {
    constructor() {
        super();
        this.setId("mapwarp");
    }
}
