
const CVF_OBSTACLE = 1;
const CVF_CHARACTER = 2;

class ContactVanishActor extends Interactor {
    constructor(flags) {
        super();
        this.setId("contactVanish");
        
        this.flags = flags;
    }
    
    interact(interrecipient) {
        if(interrecipient.flags & this.flags) {
            let recipient = interrecipient.getRecipient();
            
            // recipient.setEnergy(0);
            removeEntity(recipient);
        }
        
        return this;
    }
}
