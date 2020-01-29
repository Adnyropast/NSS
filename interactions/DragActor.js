
/**
 *
 */

class DragActor extends Interactor {
    constructor(force = new Vector(0, 0)) {
        super();
        this.setId("drag");
        
        this.force = force;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        var minDim = Math.min(actor.getDimension(), recipient.getDimension());
        
        var negotiatedForce = interrecipient.negotiateForce(this.force);
        
        for(var dim = 0; dim < minDim; ++dim) {
            recipient.speed[dim] += negotiatedForce[dim];
        }
        
        return this;
    }
}

class VacuumDragActor extends Interactor {
    constructor(vacuum = 0) {
        super();
        this.setId("drag");
        
        this.vacuum = vacuum;
    }
    
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        let minDim = Math.min(actor.getDimension(), recipient.getDimension());
        
        for(let dim = 0; dim < minDim; ++dim) {
            recipient.speed[dim] += interrecipient.negotiateDimension(dim, this.vacuum * Math.sign(actor.getPositionM(dim) - recipient.getPositionM(dim)));
        }
        
        return this;
    }
}
