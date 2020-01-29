
class WaterActor extends Interactor {
    constructor() {
        super();
        this.setId("water");
    }
    
    interact(interrecipient) {
        interrecipient.getRecipient().replaceStateObject({name : "water", countdown : 2});
        
        return this;
    }
}
