
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
            this.hit = new Entity([NaN, NaN], [32, 32]);
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

class Buff extends Action {
    constructor() {
        
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
        this.id = "smoke";
        
        this.t = 0;
        this.angleVariation = 0.5;
        this.smokeLifespan = 60;
        this.smokeWidth = 16;
        this.smokeHeight = 16;
    }
    
    use() {
        ++this.t;
        
        var particle = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getYM()], [16, 16]);// .setCollidable(true).setReplaceable(true);
        particle.setSizeTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth / 2, this.smokeHeight / 2], this.smokeLifespan);
        
        var angle = Math.sin(this.t) * this.angleVariation;
        particle.setSpeed(this.user.speed.rotated(angle + Math.PI).normalize(2));
        addEntity(particle);
        
        var particle = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getYM()], [16, 16]);// .setCollidable(true).setReplaceable(true);
        particle.setSizeTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth / 4, this.smokeHeight / 4], this.smokeLifespan);
        
        var angle = Math.sin(this.t) * this.angleVariation;
        particle.setSpeed(this.user.speed.rotated(angle + Math.PI).normalize(2));
        addEntity(particle);
        
        var particle = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getYM()], [16, 16]);// .setCollidable(true).setReplaceable(true);
        particle.setSizeTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth / 8, this.smokeHeight / 8], this.smokeLifespan);
        
        var angle = Math.sin(this.t) * -this.angleVariation;
        particle.setSpeed(this.user.speed.rotated(angle + Math.PI).normalize(2));
        addEntity(particle);
        
        var particle = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getYM()], [16, 16]);// .setCollidable(true).setReplaceable(true);
        particle.setSizeTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth / 2, this.smokeHeight / 2], this.smokeLifespan);
        
        var angle = Math.sin(this.t) * 0.125;
        particle.setSpeed(this.user.speed.rotated(angle + Math.PI).normalize(2));
        addEntity(particle);
        
        return this;
    }
    
    preventsAddition() {return false;}
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
        
        this.zone = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.zone = Entity.fromMiddle([this.user.getXM(), this.user.getYM()], [0, 0]).setZIndex(this.user.getZIndex() + 1);
            addEntity(this.zone);
        } else if(this.phase == 100) {
            return this.end();
        }
        
        this.zone.setSizeM([this.phase * 8, this.phase * 8]);
        this.zone.setStyle("rgba(0, 255, 255, " + (this.phase / 100) + ")");
        
        return this;
    }
    
    onend() {
        removeEntity(this.zone);
        
        engageBattle(this.zone.collidedWith);
        
        return this;
    }
}
