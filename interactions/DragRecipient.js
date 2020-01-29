
class DragRecipient extends Interrecipient {
    constructor(forceFactor = 1) {
        super();
        this.setId("drag");
        
        this.forceFactor = forceFactor;
    }
    
    negotiateForce(force) {
        var negotiated = [];
        
        for(var dim = 0; dim < force.length; ++dim) {
            negotiated[dim] = this.negotiateDimension(dim, force[dim]);
        }
        
        return negotiated;
    }
    
    negotiateDimension(dimension, value) {
        if(this.recipient.hasState("ladder")) {return 0;}
        
        return value * this.forceFactor;
    }
}
