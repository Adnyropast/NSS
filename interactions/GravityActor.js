
/**
 *
 */

class GravityActor extends Interactor {
    constructor(force = [0, 0]) {
        super();
        this.setId("gravity");
        
        this.force = force;
    }
    
    interact(interrecipient) {
        var recipient = interrecipient.getRecipient();
        
        // recipient.gravityDirection.add(this.force);
        
        let gravityState = recipient.findState("gravity")
        
        if(typeof gravityState == "undefined") {
            recipient.addStateObject({name:"gravity", direction:Vector.filled(recipient.getDimension(), 0).add(this.force), countdown:2});
        } else {
            gravityState.direction.add(this.force);
            gravityState.countdown = 2;
        }
        
        return this;
    }
}
