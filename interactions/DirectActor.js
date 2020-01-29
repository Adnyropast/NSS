
/**
 *
 */

class DirectActor extends Interactor {
    constructor(direction) {
        super();
        this.setId("direct");
        
        this.direction = direction;
    }
    
    interact(interrecipient) {
        interrecipient.getRecipient().setSpeed();
        
        return this;
    }
}
