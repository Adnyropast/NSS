
class ReplaceRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("replace");
    }
    
    beforeInteraction(interactor) {
        let actor = interactor.getActor();
        let recipient = this.getRecipient();
        
        let groundSave = recipient.findState("groundSave");
        
        if(typeof groundSave == "undefined") {
            if(recipient.lifeCounter > 2) {
                recipient.addState("land");
                recipient.triggerEvent("land", new EntityLandEvent(actor));
            }
            recipient.addStateObject({name:"groundSave", countdown:4});
        } else {
            groundSave.countdown = 4;
        }
        
        return this;
    }
}
