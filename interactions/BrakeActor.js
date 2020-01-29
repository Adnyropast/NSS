
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
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        var minDim = Math.min(actor.getDimension(), recipient.getDimension());
        
        for(var dim = 0; dim < minDim; ++dim) {
            recipient.speed[dim] /= interrecipient.negotiateBrake(this.brakeValue);
            
            if(isAlmostZero(recipient.speed[dim])) {
                recipient.speed[dim] = 0;
            }
        }
        
        return this;
    }
}
