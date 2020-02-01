
class WaterActor extends Interactor {
    constructor() {
        super();
        this.setId("water");
    }
    
    interact(interrecipient) {
        const recipient = interrecipient.getRecipient();
        
        recipient.replaceStateObject({name : "water", countdown : 2});
        
        if(recipient.getViewType && recipient.getViewType() === "side") {
            recipient.drag([0, -0.24]);
        }
        
        return this;
    }
    
    confirmInteraction(interrecipient) {
        const actor = this.getActor();
        const recipient = interrecipient.getRecipient();
        
        if(recipient.getViewType && recipient.getViewType() === "side") {
            return recipient.getY1() + recipient.getHeight()/2 >= actor.getY1();
        }
        
        return true;
    }
}
