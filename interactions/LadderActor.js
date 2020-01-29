
class LadderActor extends Interactor {
    constructor() {
        super();
        this.setId("ladder");
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        recipient.replaceStateObject({name : "ladder", countdown : 2});
        recipient.brake(1.25);
        
        return this;
    }
    
    confirmInteraction(interrecipient) {
        const actor = this.getActor();
        const recipient = interrecipient.getRecipient();
        
        if(!recipient.getGravityDirection().isZero()) {
            return recipient.hasState("ladder") || (recipient.hasState("lookup") && recipient.getY1() >= actor.getY1() && !recipient.findState("noLadder"));
        }
        
        return false;
    }
}
