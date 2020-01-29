
class WallActor extends Interactor {
    constructor() {
        super();
        this.setId("wall");
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        let locate = recipient.locate(actor);
        
        if(locate & 1 || locate & 2) {
            recipient.addStateObject({"name" : "wall", "countdown" : 10, "locate" : locate, "side" : !!(locate & 1) - !!(locate & 2)});
        }
        
        return this;
    }
}
