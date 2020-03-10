
class ContactVanishRecipient extends Interrecipient {
    constructor(flags) {
        super();
        this.setId("contactVanish");
        
        this.flags = flags;
    }
    
    oninteraction(interactor) {
        if(this.flags & interactor.flags) {
            const actor = interactor.getActor();
            const recipient = this.getRecipient();
            
            const eventObject = new BumpEntityEvent(actor);
            eventObject.flags = interactor.flags;
            recipient.triggerEvent("contactvanish", eventObject);
        }
        
        return this;
    }
}
