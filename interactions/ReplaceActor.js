
/**
 *
 */

class ReplaceActor extends Interactor {
    constructor(replaceId = -1, bounce = 0) {
        super();
        this.setId("replace");
        
        this.replaceId = replaceId;
        this.bounce = bounce;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        /**
        
        if(recipient instanceof Character && recipient.speed.getNorm() > 4) {
            let averagesize = (recipient.getWidth() + recipient.getHeight()) / 2;
            let c = Math.min(16, Math.floor(recipient.speed.getNorm()));
            
            // for(var angle = Math.PI / 2; angle < 2 * Math.PI + Math.PI / 2; angle += Math.PI / 3) {
            for(let i = 0; i < c; ++i) {
                let angle = -Math.PI/8 + i * 2*Math.PI/c;
                
                var cos = Math.cos(angle), sin = Math.sin(angle);
                
                let directions = getDD(recipient.locate(actor));
                let vect = Vector.filled(recipient.getDimension(), 0);
                
                for(let i = 0; i < directions.length; ++i) {
                    vect[directions[i].dimension] = directions[i].sign * averagesize/2;
                }
                
                let size = [averagesize, averagesize];
                
                var particle = SmokeParticle.fromMiddle(vect.plus(recipient.getPositionM()), size);
                particle.setSpeed((new Vector(2*cos*Math.random(), 2*sin*Math.random())).normalize(Math.random()));
                addEntity(particle);
            }
        }
        
        /**/
        
        actor.replace(recipient, this.replaceId, this.bounce);
        
        for(var dim = 0; dim < Math.min(actor.getDimension(), recipient.getDimension()); ++dim) {
            recipient.position[dim] += actor.speed[dim];
        }
        
        return this;
    }
}

class SoftReplaceActor extends ReplaceActor {
    constructor() {
        super(4);
        // this.setId("softReplace");
        
        this.brakeValue = BRK_OBST;
        this.thrustValue = THRUSTFACTOR_OBSTACLE;
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        recipient.brake(this.brakeValue);
        actor.replace(recipient, 4);
        recipient.speed[1] = 0;
        
        return this;
    }
    
    confirmInteraction(interrecipient) {
        const actor = this.getActor();
        const recipient = interrecipient.getRecipient();
        
        return !recipient.hasState("crouch") && recipient.speed[1] > 0 && (actor.locate(recipient) & 4);
    }
}
