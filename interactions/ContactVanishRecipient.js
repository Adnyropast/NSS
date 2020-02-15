
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
            
            /**
            
            for(let i = 0; i < 8; ++i) {
                let angle = i * 2*Math.PI/8;
                
                var particle = SmokeParticle.fromMiddle(recipient.getPositionM(), [8, 8]);
                particle.setSpeed((new Vector(1, 0)).rotated(angle).normalize(Math.random()));
                
                addEntity(particle);
            }
            
            /**
            
            let averagesize = rectangle_averageSize(recipient);
            let particle = SpikeSmokeParticle.fromMiddle(recipient.getPositionM(), [averagesize, averagesize]);
            particle.setSpeed(recipient.speed.normalized(-0.5));
            
            addEntity(particle);
            
            /**/
        }
        
        return this;
    }
}
