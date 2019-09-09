
function setDefaultDamageable(entity) {
    
}

/**
 *
 */

class StunActor extends Interactor {
    constructor(timeout = 24) {
        super();
        this.setId("stun");
        this.timeout = timeout;
    }
    
    interact(interrecipient) {
        let negotiatedTimeout = interrecipient.negotiateTimeout(this.timeout);
        
        if(negotiatedTimeout > 0) {
            interrecipient.getRecipient().addAction(new StunState(negotiatedTimeout));
        }
        
        return this;
    }
}

class StunRecipient extends Interrecipient {
    constructor(factor = 1) {
        super();
        this.setId("stun");
        this.factor = factor;
    }
    
    negotiateTimeout(timeout) {return timeout * this.factor;}
}
