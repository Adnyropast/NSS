
class TCamera extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setZIndex(-1000);
        this.setStyle(INVISIBLE);
        this.setCollidable(true);
        this.setSelfBrake(1.25);
        this.setEffectFactor("default", 0);
        
        this.ratio = 1;
        this.accVal = 1.125;
        this.accVal = 4;
        this.cameraControllable = true;
        
        this.addPossibleAction(Movement);
    }
    
    getOffsetX() {
        return this.getXM() - BASEWIDTH / 2;
    }
    
    getOffsetY() {
        return this.getYM() - BASEHEIGHT / 2;
    }
    
    getOffset() {
        return new Vector(this.getOffsetX(), this.getOffsetY());
    }
    
    getRatio() {
        return this.ratio;
    }
    
    setRatio(ratio) {
        this.ratio = ratio;
        
        return this;
    }
    
    oncollision(other) {
        return this;
    }
    
    update() {
        /**/
        if(this.cameraControllable) {
            if(keyList.value(100)) {
                this.drag([-this.accVal, 0]);
            } if(keyList.value(104)) {
                this.drag([0, -this.accVal]);
            } if(keyList.value(102)) {
                this.drag([+this.accVal, 0]);
            } if(keyList.value(101)) {
                this.drag([0, +this.accVal]);
            }
        }
        /**/
        
        if(this.target != null) {
            this.route = this.target.getPositionM();
            this.addAction((new MovementTo(this.accVal)).setUseCost(0));
        } else {
            this.route = null;
            this.removeActionsWithConstructor(Movement);
        }
        
        /**/
        
        // this.advance();
        super.update();
        
        return this;
    }
}

class CameraBoundary extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setReplaceId(-1);
        this.setEffectFactor("default", 0);
    }
    
    oncollision(camera) {
        if(camera instanceof TCamera) {
            this.replace(camera, this.getReplaceId());
        }
        
        return this;
    }
}
