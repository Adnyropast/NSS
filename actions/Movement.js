
class Movement extends Action {
    constructor(power) {
        super();
        this.id = ACT_MOVEMENT;
        // this.setUseCost(0.125);
        
        this.direction = new Vector(0, 0);
        this.power = power;
    }
    
    use() {
        if(this.getUseCost() >= this.user.getEnergy()) {
            return this.end("not enough energy");
        }
        
        if(this.user.route != null) {
            var power = this.power;
            
            if(typeof power == "undefined") {
                power = this.user.thrust;
            }
            
            var vector = Vector.subtraction(this.user.route, this.user.getPositionM()).normalize(power);
            
            for(var dim = 0; dim < this.user.gravityDirection.length; ++dim) {
                if(this.user.gravityDirection[dim] != 0 && vector[dim] != 0) {
                    if(Math.sign(this.user.gravityDirection[dim]) == Math.sign(vector[dim])) {
                        this.user.addState("crouching");
                        vector[dim] = 0;
                    } else {
                        this.user.addState("lookup");
                        vector[dim] = 0;
                    }
                }
            }
            
            this.user.drag(vector);
            
            if(!vector.isZero()) {
                this.user.addState("moving");
                this.user.hurt(this.useCost);
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
}

class Still extends Movement {
    constructor() {
        super();
        this.setUseCost(0);
    }
    
    use() {
        return this;
    }
    
    allowsReplacement(action) {
        return false;
    }
}

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
            if(Vector.distance(this.user.route, this.user.getPositionM()) < this.user.speed.getNorm() + this.power) {
                this.user.setPositionM(this.user.route);
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
