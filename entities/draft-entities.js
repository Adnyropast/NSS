
class Area extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        
        this.otherThrust = 0.5;
    }
}

class NonlivingCollidable extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.collidable = true;
        this.setEffectFactor("default", 0);
    }
}

class Obstacle extends NonlivingCollidable {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.replaceID = -1;
        this.otherBrake = 1.25;
        this.otherThrust = 0.5;
    }
}

class Braker extends NonlivingCollidable {
    constructor(x, y, width, height, otherBrake) {
        super(x, y, width, height);
        this.setReplaceID(0);
        this.otherBrake = otherBrake;
        this.setStyle("#00000000");
    }
}

class GravityField extends NonlivingCollidable {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setReplaceID(0);
        this.setOtherBrake(1);
        this.force = [0, +0.25];
    }
}

class Decoration extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.collidable = false;
        this.setEffectFactor("default", 0);
    }
}

class MovingObstacle extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
    
    update() {
        this.speed = new Vector(0, 0);
        this.speed.set(0, 0.1);
        this.advance();
        
        return this;
    }
}

class TCamera extends Entity {
    constructor(xM, yM, width, height) {
        super(NaN, NaN, width, height);
        this.setPositionM([xM, yM]);
        this.setZIndex(-1000);
        this.setStyle("#00000000");
        this.setCollidable(true);
        this.setSelfBrake(1.25);
        this.setEffectFactor("default", 0);
        
        this.ratio = 1;
        this.accVal = 1.125;
        this.accVal = 4;
        this.cameraControllable = true;
    }
    
    getOffsetX() {
        return this.getXM() - CANVAS.width / 2;
    }
    
    getOffsetY() {
        return this.getYM() - CANVAS.height / 2;
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
        } else {
            this.route = null;
        }
        
        this.addAction((new Movement(this.accVal)).setUseCost(0));
        
        /**/
        
        // this.advance();
        super.update();
        
        return this;
    }
}

class CameraBoundary extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setReplaceID(-1);
        this.setEffectFactor("default", 0);
    }
    
    oncollision(camera) {
        if(camera instanceof TCamera) {
            this.replace(camera, this.getReplaceID());
        }
        
        return this;
    }
}

class Hazard extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setOffense("default", 1);
    }
}

class Ground extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
}

class GroundArea extends Ground {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setReplaceID(0);
        this.otherThrust = 0.5;
    }
}

class Target extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setEffectFactor("default", 1);
    }
}

class Router extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setStyle("FF7FFF3F");
        
        this.table = [];
    }
    
    oncollision(other) {
        
        
        return this;
    }
}
