
/**
 *
 */

class GroundActor extends Interactor {
    constructor() {
        super();
        this.setId("ground");
    }
    
    interact(interrecipient) {
        var recipient = interrecipient.getRecipient();
        
        recipient.addState("grounded");
        
        if(typeof recipient.getViewType === "function" && recipient.getViewType() === "side") {
            if(recipient.locate(this.getActor()) & 8) {
                recipient.replaceStateObject({name:"actuallyGrounded", countdown:2});
                recipient.replaceStateObject({name:"midairJump", count:recipient.stats["midairJump-count"]});
            }
        }
        
        return this;
    }
}

class GroundAreaActor extends Interactor {
    constructor() {
        super();
        this.setId("ground");
    }
    
    interact(interrecipient) {
        var recipient = interrecipient.getRecipient();
        
        recipient.replaceStateObject({name:"actuallyGrounded", countdown:2});
        
        return this;
    }
}
