
/**
 * Interactions define behaviors upon a collision between two entities.
 * They work in pairs : interactors and interrecipients (respectively objects associated to actors and recipients of an interaction).
 * The interactors and interrecipients of the same interaction share the same id.
 * Interactors decide what happens during a collision (the recipient gets dragged, braked, ...), but interrecipients can have some power over the interaction (how much relative to the original values the recipient gets dragged, braked, ...).
 */

/**

class Interaction {
    constructor() {
        
    }
}

class CollisionInteraction {
    
}

/**/

let interactionPriorities = {
    "ground" : -1,
    "replace" : 1000
};

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
    
    collides(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        for(var i = 0; i < actor.collidedWith.length; ++i) {
            if(actor.collidedWith[i] == recipient) {
                return true;
            }
        }
        
        var collision = this.getActor() != interrecipient.getRecipient() && this.getActor().collides(interrecipient.getRecipient()) && !this.getActor().findBlacklist(interrecipient.getRecipient());
        
        if(collision) {
            actor.collidedWith.add(recipient);
            recipient.collidedWith.add(actor);
        }
        
        return collision;
    }
    
    confirmInteraction(interrecipient) {
        return true;
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
    
    negotiate(interactor) {
        return {};
    }
    
    beforeInteraction(interactor) {return this;}
}
