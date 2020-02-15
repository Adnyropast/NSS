
class AirStateGranter extends Interactor {
    constructor() {
        super();
        this.setId("airState");
    }
    
    interact(interrecipient) {
        const recipient = interrecipient.getRecipient();
        
        recipient.replaceStateObject({name: "air", countdown: 2});
        
        return this;
    }
}
