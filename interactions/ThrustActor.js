
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
        let actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        let value = interrecipient.negotiateThrust(this.getThrustValue());
        let negotiated = interrecipient.negotiate(this);
        
        value = negotiated.thrustValue;
        
        if(value > actor.thrust) {
            // actor.thrust = value;
        }
        
        // 
        
        let thrustState = actor.findState("thrust");
        
        if(typeof thrustState == "undefined") {
            actor.addStateObject({name:"thrust", value:value, countdown:1});
        } else if(value > thrustState.value) {
            thrustState.value = value;
        }
        
        // 
        
        let thrustFactor = actor.findState("thrustFactor");
        
        if(typeof thrustFactor == "undefined") {
            actor.addStateObject({name:"thrustFactor", value:interrecipient.thrustFactor, countdown:1});
        } else if(interrecipient.thrustFactor > thrustFactor.value) {
            thrustFactor.value = interrecipient.thrustFactor;
        }
        
        return this;
    }
    
    getThrustValue() {
        // return this.thrustValue;
        return this.getActor().getThrust();
    }
}
