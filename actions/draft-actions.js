
class TargetAttack extends Action {
    constructor() {
        super();
        this.id = 3;
        
        this.hit = null;
        this.t1 = 6;
        this.t2 = this.t1 + 20;
        this.t3 = this.t2 + 10;
    }
    
    use() {
        if(this.phase < this.t1) {
            
        } else if(this.phase == this.t1) {
            this.hit = Entity.fromMiddle(this.user.getCursor().getPositionM(), [32, 32]);
            
            addEntity(this.hit);
        } else if(this.phase < this.t2) {
            this.hit.multiplySize(1.03125);
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
        
        this.smokeClass = SmokeParticle;
    }
    
    use() {
        ++this.t;
        
        var particle = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getYM()], [16, 16]);
        particle.setSizeTransition(new ColorTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth / 2, this.smokeHeight / 2], this.smokeLifespan));
        
        var angle = Math.sin(this.t) * this.angleVariation;
        particle.setSpeed(this.user.speed.rotated(angle + Math.PI).normalize(2));
        particle.shareBlacklist(this.user.getBlacklist());
        
        addEntity(particle);
        
        var particle = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getYM()], [16, 16]);
        particle.setSizeTransition(new ColorTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth / 4, this.smokeHeight / 4], this.smokeLifespan));
        
        var angle = Math.sin(this.t) * this.angleVariation;
        particle.setSpeed(this.user.speed.rotated(angle + Math.PI).normalize(2));
        particle.shareBlacklist(this.user.getBlacklist());
        
        addEntity(particle);
        
        var particle = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getYM()], [16, 16]);
        particle.setSizeTransition(new ColorTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth / 8, this.smokeHeight / 8], this.smokeLifespan));
        
        var angle = Math.sin(this.t) * -this.angleVariation;
        particle.setSpeed(this.user.speed.rotated(angle + Math.PI).normalize(2));
        particle.shareBlacklist(this.user.getBlacklist());
        
        addEntity(particle);
        
        var particle = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getYM()], [16, 16]);
        particle.setSizeTransition(new ColorTransition([this.smokeWidth, this.smokeHeight], [this.smokeWidth / 2, this.smokeHeight / 2], this.smokeLifespan));
        
        var angle = Math.sin(this.t) * 0.125;
        particle.setSpeed(this.user.speed.rotated(angle + Math.PI).normalize(2));
        particle.shareBlacklist(this.user.getBlacklist());
        
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

class ZoneEngage extends BusyAction {
    constructor() {
        super();
        this.id = "zoneEngage";
        
        this.zone = null;
        this.wind = null;
        
        this.targets = new SetArray();
    }
    
    use() {
        if(this.phase == 0) {
            this.zone = Entity.fromMiddle([this.user.getXM(), this.user.getYM()], [0, 0]).setZIndex(this.user.getZIndex() + ALMOST_ZERO/8);
            addEntity(this.zone);
            this.wind = Entity.shared(this.zone);
            this.wind.shareBlacklist(this.user.getBlacklist());
            this.wind.addInteraction(new VacuumDragActor(-0.5));
            this.wind.addInteraction(new TypeDamager([{"type" : FX_WIND, "value" : 0.5}]));
            addEntity(this.wind);
        }
        
        // repaceLoop(WORLD_PACE + Math.pow(2, this.phase));
        worldFreeze = Math.floor(Math.pow(this.phase, 1.5));
        
        this.zone.setSizeM([this.phase * 64, this.phase * 64]);
        this.zone.setPositionM(this.user.getPositionM());
        this.zone.setStyle("rgba(0, 255, 255, " + (this.phase / 10) + ")");
        
        for(let i = 0; i < this.zone.collidedWith.length; ++i) {
            if(this.zone.collidedWith[i].isBattler()) {
                this.targets.add(this.zone.collidedWith[i]);
            }
        }
        
        if(this.phase == 10) {
            let opponentFound = false;
            
            for(let i = 0; i < this.targets.length; ++i) {
                if(this.user.opponents.includes(this.targets[i])) {
                    opponentFound = true;
                }
            }
            
            if(opponentFound) {
                engageBattle(this.targets);
            }
            
            this.end();
            
            worldFreeze = 0;
        }
        
        return this;
    }
    
    onend() {
        // repaceLoop(WORLD_PACE);
        
        removeEntity(this.zone);
        removeEntity(this.wind);
        
        return super.onend();
    }
}

class FollowMe extends Action {
    constructor() {
        super();
        this.setId("followMe");
    }
    
    use() {
        CAMERA.target = this.user;
        
        return this;
    }
    
    preventsAddition(action) {
        if(this.phase > 0 && action instanceof FollowMe) {
            this.end();
        }
        
        return super.preventsAddition(action);
    }
    
    onend() {
        CAMERA.target = null;
        
        return super.onend();
    }
}

class Summon extends Action {
    constructor(entity) {
        super();
        this.setId("summon");
        
        this.entity = entity;
    }
    
    use() {
        addEntity(this.entity);
        this.entity.allies = this.user.allies;
        this.entity.allies.add(this.entity);
        this.entity.opponents = this.user.opponents;
        
        return this.end();
    }
}

class OnceTest extends Action {
    
}

class RepeatTest extends Action {
    
}
/**
class HoldTest extends Action {
    
}
/**/
class ToggleTest extends Action {
    
}

const AS_ROUTE = set_gather("tmprRoute");

class TmprRoute extends Action {
    constructor(vector) {
        super();
        this.setId("tmprRoute");
        this.setOrder(-100);
        
        this.vector = vector;
    }
    
    use() {
        if(this.user.route == null) {
            this.user.route = this.user.getPositionM();
        }
        
        let minDim = Math.min(this.user.route.length, this.vector.length);
        
        let difference = new Vector();
        
        for(let dim = 0; dim < minDim; ++dim) {
            this.user.route[dim] += this.vector[dim];
            
            difference[dim] = this.user.route[dim] - this.user.getPositionM(dim);
            
            if(isAlmostZero(difference[dim])) {
                this.user.route[dim] = this.user.getPositionM(dim);
            }
        }
        
        return this.end();
    }
    
    preventsAddition(action) {return false;}
}

class TransitionSize extends Action {
    constructor(sizeTransition) {
        super();
        this.setId("transitionSize");
        this.sizeTransition = sizeTransition;
    }
    
    use() {
        this.user.setSizeM(this.sizeTransition.getNext());
        
        return this;
    }
}

class StunState extends BusyAction {
    constructor(timeout = 1) {
        super();
        this.setId("stunState");
        
        this.brakeRecipientSave = null;
        this.timeout = timeout;
    }
    
    onadd() {
        this.brakeRecipientSave = this.user.findInterrecipientWithId("brake");
        this.user.removeInterrecipientWithId("brake");
        this.setRemovable(false);
        
        this.user.setSelfBrake(1.125);
        
        return super.onadd();
    }
    
    onend() {
        this.user.addInteraction(this.brakeRecipientSave);
        
        this.user.setSelfBrake(1);
        
        return super.onend();
    }
    
    use() {
        if(this.timeout == 0) {
            this.setRemovable(true);
            this.end();
        } else {
            --this.timeout;
        }
        
        return this;
    }
}
