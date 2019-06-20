
class TargetAttack extends Action {
    constructor(targetPosition) {
        super();
        this.id = 3;
        
        this.targetPosition = targetPosition;
        this.hit = null;
        this.t1 = 6;
        this.t2 = this.t1 + 20;
        this.t3 = this.t2 + 10;
    }
    
    use() {
        if(this.phase < this.t1) {
            
        } else if(this.phase == this.t1) {
            this.hit = new Entity(NaN, NaN, 32, 32);
            this.hit.setPositionM(this.targetPosition);
            
            addEntity(this.hit);
        } else if(this.phase < this.t2) {
            this.hit.multiplySize(1/1.03125);
        } else if(this.phase == this.t2) {
            removeEntity(this.hit);
        } else if(this.phase < this.t3) {
            
        } else {
            this.end();
        }
        
        return this;
    }
}

class Movement extends Action {
    constructor(power) {
        super();
        this.id = 4;
        this.setUseCost(0.125);
        
        this.direction = new Vector(0, 0);
        this.power = power;
    }
    
    use() {
        if(this.user.route != null) {
            this.power = this.user.thrust;
            this.user.drag(Vector.subtraction(this.user.route, this.user.getPositionM()).normalize(this.power));
            this.user.addState("walking");
        }
        
        this.end();
        
        return this;
    }
}

class Shield extends Entity {
    
}

class Protect extends Action {
    constructor() {
        super();
        this.interruptible = true;
    }
    
    use() {
        
    }
}

class Counter extends Action {
    
}

class BackSmoke extends Action {
    constructor() {
        super();
        
        this.t = 0;
        this.angleVariation = 1;
        this.shouldEnd = false;
        this.smokeLifespan = 30;
        this.smokeWidth = 16;
        this.smokeHeight = 16;
    }
    
    use() {
        ++this.t;
        
        var particle = new TpParticle(NaN, NaN, 16, 16);
        particle.setColorTransition([255, 0, 0, 127], [0, 0, 0, 127], this.smokeLifespan);
        particle.setColorTransition([0, 255, 255, 127], [0, 255, 255, 0], 30);
        particle.setSizeTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth * 2, this.smokeHeight * 2], this.smokeLifespan);
        particle.setPositionM(this.user.getPositionM());
        particle.setLifespan(this.smokeLifespan);
        var angle = Math.sin(this.t) * this.angleVariation;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        particle.speed = new Vector(cos * -this.user.speed[0] - sin * -this.user.speed[1], sin * -this.user.speed[0] + cos * -this.user.speed[1]).normalize(2);
        particle.setSelfBrake(1.15);
        particle.setCollidable(true).setReplaceable(true);
        particle.setWhitelist(NOENTITY);
        addEntity(particle);
        /**/
        if(this.shouldEnd) {
            this.end();
        }
        
        return this;
    }
}

class Walk extends Movement {
    use() {
        if(!this.user.groundCheck) {
            this.end();
        }
        
        return this;
    }
}

class DashKick extends Action {
    constructor() {
        super();
        this.id = "dashkick";
        
        this.direction = null;
        this.force = 8;
    }
    
    use() {
        if(this.phase == 0) {
            this.direction = this.user.direction;
        }
        
        if(this.phase = 6) {
            this.user.drag(this.direction.times(this.force));
        }
        
        if(this.phase == 20) {
            this.end();
        }
        
        return this;
    }
}

class ZoneEngage extends Action {
    constructor() {
        super();
        this.id = "engage";
    }
    
    use() {
        
    }
}

class Still extends Movement {
    
}
