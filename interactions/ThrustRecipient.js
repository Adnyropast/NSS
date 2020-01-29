
class ThrustRecipient extends Interrecipient {
    constructor(thrustFactor = 1) {
        super();
        this.setId("thrust");
        
        this.thrustFactor = thrustFactor;
    }
    
    negotiateThrust(thrustValue) {
        return thrustValue * this.thrustFactor;
    }
    
    negotiate(interactor) {
        return {"thrustValue" : interactor.getThrustValue() * this.thrustFactor};
    }
}

class SoftThrustRecipient extends ThrustRecipient {
    negotiate(interactor) {
        let actor = interactor.getActor();
        let recipient = this.getRecipient();
        
        if(!actor.hasState("crouch") && actor.speed[1] >= 0 && (recipient.locate(actor) & 4)) {
            return super.negotiate(...arguments);
        }
        
        return {"thrustValue" : 0};
    }
}
