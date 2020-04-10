
let mapTransitioning = false;

function mapTransition(mapName, warpPositionM, focusPosition) {
    if(!mapTransitioning) {
        mapTransitioning = true;
        getCurrentChapter().playerPositionM = warpPositionM;
        updateCurrentCharacter();
        
        transitionIn(16, gamePoint_positionOnCanvas(focusPosition));
        
        setGameTimeout(function() {
            saveMapState();
            loadMap(mapName);
            
            if(getCurrentChapter().saveOnWarp) {
                saveGameState();
                updateSaveState({chapterPath : getInventoryItemPath(getCurrentChapter())});
            }
            
            transitionOut(16, gamePoint_positionOnCanvas(warpPositionM));
            
            mapTransitioning = false;
        }, 16);
    }
}

/**
 *
 */

class MapWarper extends Interactor {
    constructor(mapName, warpPositionM = [0, 0]) {
        super();
        this.setId("mapwarp");
        
        this.mapName = mapName;
        this.warpPositionM = warpPositionM;
    }
    
    interact(interrecipient) {
        const recipient = interrecipient.getRecipient();
        
        if(!mapTransitioning) {
            mapTransition(this.mapName, this.warpPositionM, recipient.getPositionM());
            removeEntity(recipient);
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
