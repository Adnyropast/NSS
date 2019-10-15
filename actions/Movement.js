
const AS_MOVEMENT = set_gather(ACT_MOVEMENT, "wallCling", "crouch", "lookup", "movementLeft", "movementUp", "movementRight", "movementDown", "linearMovement", "still");

class Movement extends Action {
    constructor(power) {
        super();
        this.id = ACT_MOVEMENT;
        // this.setUseCost(0.125);
        
        this.direction = new Vector(0, 0);
        this.power = power;
        
        this.wallCling = new WallCling();
        this.crouch = new Crouch();
        this.lookup = new LookUp();
    }
    
    getBasePower() {
        
    }
    
    getDirection() {
        
    }
    
    use() {
        let thrust = this.user.findState("thrust");
        
        if(typeof thrust == "undefined") {thrust = 0;}
        else {thrust = thrust.value;}
        
        let thrustFactor = this.user.findState("thrustFactor");
        
        if(typeof thrustFactor == "undefined") {thrustFactor = 0;}
        else {thrustFactor = thrustFactor.value;}
        
        var vector = null;
        
        if(this.user.route != null) {
            vector = Vector.subtraction(this.user.route, this.user.getPositionM());
        }
        
        let full = true;
        
        if(this.getUseCost() >= this.user.getEnergy()) {
            // return this.end("not enough energy");
            full = false;
        }
        
        if(vector != null) {
            var power = this.power;
            
            if(typeof power == "undefined") {
                power = thrust;
            }
            
            if(!full) {power /= 2;}
            
            vector.normalize(power);
            
            let gravityDirection = this.user.findState("gravity");
            
            if(typeof gravityDirection == "undefined" || this.user.hasState("ladder")) {gravityDirection = [0, 0];}
            else {gravityDirection = gravityDirection.direction;}
            
            for(var dim = 0; dim < gravityDirection.length; ++dim) {
                if(gravityDirection[dim] != 0 && vector[dim] != 0) {
                    if(Math.sign(gravityDirection[dim]) == Math.sign(vector[dim])) {
                        this.user.addAction(this.crouch);
                        vector[dim] = 0;
                    } else {
                        this.user.addAction(this.lookup);
                        vector[dim] = 0;
                    }
                }
            }
            
            let grounded = this.user.hasState("actuallyGrounded");
            let wallState = this.user.findState("wall");
            
            if(typeof wallState != "undefined") {this.user.addAction(this.wallCling);}
            // else {this.user.removeAction(this.wallCling);}
            
            this.user.drag(vector);
            
            if(!vector.isZero()) {
                if(grounded || typeof wallState == "undefined") {
                    this.user.addState("moving");
                }
                
                if(full) {
                    this.user.hurt(this.getUseCost());
                }
            }
        }
        
        return this;
    }
    
    allowsReplacement(action) {
        return action instanceof Still;
    }
    
    onadd() {
        // console.log("added movement");
        
        return super.onadd();
    }
    
    onend() {
        this.user.removeAction(this.wallCling);
        this.user.removeAction(this.crouch);
        this.user.removeAction(this.lookup);
        
        return super.onend();
    }
}

class DirectionMovement extends Movement {
    constructor() {
        super();
        this.setId("directionMovement");
    }
    
    use() {
        
        
        return this;
    }
    
    
}

class Still extends Action {
    constructor() {
        super();
        this.setId("still");
        this.setUseCost(0);
    }
    
    use() {
        this.user.setFace(this.user.getCursorDirection()[0]);
        
        return this;
    }
    
    allowsReplacement(action) {
        return false;
    }
    
    preventsAddition(action) {
        return action instanceof Movement;
    }
}

AC["still"] = Still;

class MovementTo extends Movement {
    constructor(power) {
        super(power);
        
        this.previousPosition = null;
    }
    
    use() {
        if(this.getUseCost() >= this.user.getEnergy()) {
            return this.end();
        }
        
        if(typeof this.power == "undefined") {
            this.power = this.user.thrust;
        }
        
        if(this.user.route != null) {
            let minDim = Math.min(this.user.getDimension(), this.user.route.length);
            let distance = 0;
            
            for(let dim = 0; dim < minDim; ++dim) {
                distance += Math.pow(this.user.route[dim] - this.user.getPositionM(dim), 2);
            }
            
            distance = Math.sqrt(distance);
            
            if(distance < this.user.speed.getNorm() + this.power) {
                this.user.fillPositionM(this.user.route);
                return this;
            }
            
            this.user.drag(Vector.subtraction(this.user.route, this.user.getPositionM()).normalize(this.power));
            this.user.addState("walking");
            this.user.hurt(this.useCost);
        }
        
        return this;
    }
}

class ImmediateMovement extends Movement {
    use() {
        
        
        return this;
    }
}

class RunToggle extends Action {
    constructor() {
        super();
        this.setId("runToggle");
    }
    
    use() {
        this.user.addState("running");
        
        var particle = Particle.fromMiddle([this.user.getXM(), this.user.getYM()], [8, 8]).setZIndex(-97);
        particle.setColorTransition([0, 255, 255, 255], [0, 255, 255, 0], 16);
        particle.setLifespan(16);
        
        addEntity(particle);
        
        return this;
    }
}

class WallCling extends Action {
    constructor(side) {
        super();
        this.setId("wallCling");
    }
    
    use() {
        this.user.setFace(this.user.cursor.getXM() - this.user.getXM());
        
        return this;
    }
}

class Crouch extends Action {
    constructor() {
        super();
        this.setId("crouch");
        
        this.regeneration = new Regeneration(0.0625);
        this.saveSize = null;
        this.saveDrawableOffset = null;
    }
    
    use() {
        let state = this.user.findState("crouch");
        
        if(typeof state == "undefined") {
            this.user.addStateObject({"name" : "crouch", "countdown" : 8});
        } else {
            state.countdown = 8;
        }
        
        return this;
    }
    
    onadd() {
        this.user.addAction(this.regeneration);
        this.saveSize = this.user.getSize();
        let y2 = this.user.getY2();
        this.user.setSize([this.user.getWidth(), this.user.getHeight() / 2]);
        this.user.setY2(y2);
        this.saveDrawableOffset = Vector.from(this.user.drawableOffset);
        this.user.drawableOffset = new Vector(0, -this.user.getHeight()/2);
        
        return super.onadd();
    }
    
    onend() {
        this.user.removeAction(this.regeneration);
        let y2 = this.user.getY2();
        this.user.setSize(this.saveSize);
        this.user.setY2(y2);
        this.user.drawableOffset = this.saveDrawableOffset;
        
        return super.onend();
    }
}

class LookUp extends Action {
    constructor() {
        super();
        this.setId("lookup");
    }
    
    use() {
        this.user.addStateObject({"name" : "lookup", "countdown" : 5});
        
        return this;
    }
}

class LinearMovement extends Action {
    constructor(direction = new Vector(0, 0)) {
        super();
        this.setId("linearMovement");
        
        this.direction = direction;
    }
    
    use() {
        this.user.drag(this.direction);
        
        return this;
    }
}
