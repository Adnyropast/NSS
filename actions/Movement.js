
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
        const isHanging = this.user.hasState("ladder");
        const isGrounded = this.user.hasState("actuallyGrounded");
        const isUnderwater = this.user.hasState("water");
        const isWallClinging = this.user.hasState("wall");
        const isAirborne = !isHanging && !isGrounded && !isUnderwater;
        
        // 
        
        let thrust = this.user.findState("thrust");
        
        if(typeof thrust == "undefined") {thrust = 0;}
        else {thrust = thrust.value;}
        
        let thrustFactor = this.user.findState("thrustFactor");
        
        if(typeof thrustFactor == "undefined") {thrustFactor = 0;}
        else {thrustFactor = thrustFactor.value;}
        
        let direction = null;
        
        if(this.user.route != null) {direction = Vector.subtraction(this.user.route, this.user.getPositionM());}
        
        if(direction != null) {
            var power = this.power;
            
            if(typeof power == "undefined") {
                power = thrust;
            }
            
            direction.normalize(power);
            
            let gravityDirection = this.user.getGravityDirection();
            
            if(isHanging || isUnderwater) {
                gravityDirection = new Vector(0, 0);
            }
            
            /**/
            
            for(var dim = 0; dim < gravityDirection.length; ++dim) {
                if(gravityDirection[dim] != 0 && direction[dim] != 0) {
                    if(Math.sign(gravityDirection[dim]) == Math.sign(direction[dim])) {
                        if(Math.abs(direction.angleBetween(gravityDirection)) < Math.PI/4) {
                            this.user.addAction(this.crouch);
                        }
                    } else {
                        if(Math.abs(direction.angleBetween(gravityDirection.times(-1))) < Math.PI/4) {
                            this.user.addAction(this.lookup);
                        }
                    }
                    
                    direction[dim] = 0;
                }
            }
            
            /**
            
            if(Math.abs(direction.angleBetween(gravityDirection)) < Math.PI/4) {
                this.user.addAction(this.crouch);
            } else if(Math.abs(direction.angleBetween(gravityDirection.times(-1))) < Math.PI/4) {
                this.user.addAction(this.lookup);
            }
            
            /**/
            
            if(isWallClinging) {this.user.addAction(this.wallCling);}
            // else {this.user.removeAction(this.wallCling);}
            
            this.user.drag(direction);
            
            if(!direction.isZero()) {
                this.user.addState("moving");
                
                if(isHanging) {
                    this.user.triggerEvent("climb", {action: this});
                } else if(isGrounded) {
                    this.user.triggerEvent("walk", {action: this});
                    
                    if(this.phase === 0) {
                        this.user.triggerEvent("walkstart", {action: this});
                    }
                } else if(isUnderwater) {
                    this.user.triggerEvent("swim", {action: this});
                } else if(isWallClinging) {
                    this.user.triggerEvent("cling", {action: this});
                } else {
                    this.user.triggerEvent("drift", {action: this});
                }
                
                if(this.getUseCost() < this.user.getEnergy()) {
                    // return this.end("not enough energy");
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
        this.user.triggerEvent("movementend", {action: this});
        
        return super.onend();
    }
    
    
}

busyBannedActions.add(Movement);

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
        
        this.end();
        
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
        this.user.replaceStateObject({"name" : "crouch", "countdown" : 8});
        this.user.triggerEvent("crouch");
        
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
        this.user.replaceStateObject({"name" : "lookup", "countdown" : 5});
        this.user.triggerEvent("lookup");
        
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

let movementCost = 0.09375;

class MovementLeft extends Action {
    constructor() {
        super();
        this.setId("movementLeft");
    }
    
    use() {
        this.user.addAction(new TmprRoute([-BIG, 0]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(movementCost));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}

class MovementUp extends Action {
    constructor() {
        super();
        this.setId("movementUp");
    }
    
    use() {
        this.user.addAction(new TmprRoute([0, -BIG]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(movementCost));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}

class MovementRight extends Action {
    constructor() {
        super();
        this.setId("movementRight");
    }
    
    use() {
        this.user.addAction(new TmprRoute([+BIG, 0]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(movementCost));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}

class MovementDown extends Action {
    constructor() {
        super();
        this.setId("movementDown");
    }
    
    use() {
        this.user.addAction(new TmprRoute([0, +BIG]));
        this.user.addAction(new MoveFocus());
        this.user.addAction(new Movement().setUseCost(movementCost));
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
}

AC["movementLeft"] = MovementLeft;
AC["movementUp"] = MovementUp;
AC["movementRight"] = MovementRight;
AC["movementDown"] = MovementDown;
