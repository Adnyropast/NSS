
/**
 *
 */

let maptransitioning = false;

class MapWarper extends Interactor {
    constructor(mapname, warpPositionM = [0, 0]) {
        super();
        this.setId("mapwarp");
        
        this.mapname = mapname;
        this.warpPositionM = warpPositionM;
    }
    
    interact(interrecipient) {
        if(!maptransitioning) {
            // loadMap(this.mapname);
            maptransitioning = true;
            getCurrentSave().playerPositionM = this.warpPositionM;
            updateCurrentCharacter();
            removeEntity(interrecipient.getRecipient());
            addEntity(new TransitionCover(this.mapname));
        }
        
        return this;
    }
}

class LookupMapWarper extends MapWarper {
    interact(interrecipient) {
        let actor = this.getActor();
        let recipient = interrecipient.getRecipient();
        
        if(recipient.hasState("lookup")) {
            let minDim = Math.min(actor.getDimension(), recipient.getDimension());
            
            for(let dim = 0; dim < minDim; ++dim) {
                if(recipient.getPosition1(dim) + recipient.getSize(dim)/4 >= actor.getPosition2(dim) || recipient.getPosition2(dim) - recipient.getSize(dim)/4 <= actor.getPosition1(dim)) {
                    return this;
                }
            }
            
            super.interact(...arguments);
        }
        
        return this;
    }
}
