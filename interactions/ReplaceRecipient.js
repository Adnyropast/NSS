
class ReplaceRecipient extends Interrecipient {
    constructor() {
        super();
        this.setId("replace");
    }
    
    beforeInteraction(interactor) {
        let actor = interactor.getActor();
        let recipient = this.getRecipient();
        
        let bumpSave = recipient.findState("bumpSave");
        
        if(typeof bumpSave == "undefined") {
            if(recipient.lifeCounter > 2) {
                recipient.triggerEvent("bump", new BumpEntityEvent(actor));
            }
        }
        
        recipient.replaceStateObject({name: "bumpSave", countdown: 4});
        
        return this;
    }
}
