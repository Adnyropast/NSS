
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
        
        this.duration = 32;
        
        this.opponentFound = false;
    }
    
    use() {
        if(this.phase === 0) {
            const positionM = this.user.getPositionM();
            
            this.zone = Entity.fromMiddle(positionM, [0, 0]).setZIndex(this.user.getZIndex() + ALMOST_ZERO/8);
            addEntity(this.zone);
            this.wind = Hitbox.shared(this.zone);
            this.wind.shareBlacklist(this.user.getBlacklist());
            this.wind.addInteraction(new VacuumDragActor(-0.5));
            this.wind.setTypeOffense(FX_WIND, 0.5);
            addEntity(this.wind);
            
            this.zone.setStyle(makeRadialGradientCanvas("cyan", "rgba(0, 255, 255, 0)", 256, 256));
            
            this.setRemovable(false);
        }
        
        // repaceLoop(WORLD_PACE + Math.pow(2, this.phase));
        // worldFreeze = Math.floor(Math.pow(this.phase, 1.5));
        
        this.zone.setSizeM([Math.pow(1.125+0.0625, this.phase), Math.pow(1.125+0.0625, this.phase)]);
        this.zone.setPositionM(this.user.getPositionM());
        // this.zone.setStyle("rgba(0, 255, 255, " + (this.phase / 10) + ")");
        
        for(let i = 0; i < this.zone.collidedWith.length; ++i) {
            if(this.zone.collidedWith[i].isBattler()) {
                this.targets.add(this.zone.collidedWith[i]);
            }
        }
        
        if(this.phase === 32) {
            for(let i = 0; i < this.targets.length; ++i) {
                if(this.user.opponents.includes(this.targets[i])) {
                    this.opponentFound = true;
                }
            }
            
            makeShockwave.lineWidth = 4;
            makeShockwave(this.zone.getPositionM(), 24)
            .getDrawable()
            .setStyle(new ColorTransition([0, 255, 255, 0.5], [0, 255, 255, 0], 24, powt(1/2)));
            makeShockwave.lineWidth = 0;
            
            removeEntity(this.zone);
            removeEntity(this.wind);
            
            if(this.opponentFound) {
                repaceLoop(64);
            }
            
            // worldFreeze = 0;
        }
        
        if(this.phase === 48) {
            
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
    
    onend() {
        // repaceLoop(WORLD_PACE);
        
        removeEntity(this.zone);
        removeEntity(this.wind);
        
        repaceLoop(16);
        
        if(this.opponentFound) {
            engageBattle(this.targets);
        }
        
        return super.onend();
    }
}

AC["zoneEngage"] = ZoneEngage;

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
        
        this.backSmoke = new BackSmoke();
    }
    
    onadd() {
        this.user.addStateObject({"name" : "hurt", "countdown" : this.timeout});
        this.brakeRecipientSave = this.user.findInterrecipientWithId("brake");
        this.user.removeInterrecipientWithId("brake");
        this.setRemovable(false);
        
        this.user.setSelfBrake(1.125);
        
        // this.user.addAction(this.backSmoke);
        
        return super.onadd();
    }
    
    onend() {
        this.user.addInteraction(this.brakeRecipientSave);
        
        this.user.setSelfBrake(1);
        
        // this.user.removeAction(this.backSmoke);
        
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

class LifespanState extends Action {
    constructor(lifespan = 1) {
        super();
        this.setId("lifespanState");
        
        this.lifespan = lifespan;
    }
    
    use() {
        --this.lifespan;
        
        if(this.lifespan == 0) {
            this.end();
        }
        
        return this;
    }
    
    allowsReplacement(action) {
        return action.sharesId(this);
    }
    
    onend() {
        removeEntity(this.user);
        
        return this;
    }
}

class SlashAction extends BusyAction {
    constructor() {
        super();
        this.setId("slashAction");
        
        this.hitbox = (new SlashEffect([NaN, NaN], [16, 16])).setLifespan(16);
        // this.hitbox.setStyle("orange");
        this.trailDrawable = new TrailDrawable();
        
        this.slashDuration = 10;
        this.startlag = 0;
        this.endlag = 4;
        
        this.baseAngleTransition = new ColorTransition([], []);
        this.baseDistanceTransition = new ColorTransition([], []);
        
        this.bladeAngleTransition = new ColorTransition([], []);
        this.bladeWidthTransition = new ColorTransition([], []);
        
        this.edgeWidthTransition = new ColorTransition([1.25], [1.25]);
        
        this.det = 3;
    }
    
    updateTrailDrawableStyle(detProgress) {
        this.trailDrawable.trailStyle;
        this.trailDrawable.edgeStyle;
        
        return this;
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        face[1] = Math.sign(face[1]);
        
        this.baseAngleTransition;
        this.baseDistanceTransition;
        
        this.bladeAngleTransition;
        this.bladeWidthTransition;
        
        this.edgeWidthTransition;
        
        return this;
    }
    
    slashUpdate() {
        let userPositionM = this.user.getPositionM();
        
        if(this.phase == 0) {
            if(!this.transitionsSetup()) {return this.end();}
            
            this.user.setFace(this.user.getCursorDirection()[0]);
            
            if(this.user.getEnergy() > this.getUseCost()) {
                this.setRemovable(false);
                this.user.hurt(this.getUseCost());
                this.user.addStateObject({name:"attack"});
            } else {
                return this.end();
            }
        }
        
        if(this.phase == this.startlag) {
            if(this.hitbox.lifespan === -1) {this.hitbox.setLifespan(this.slashDuration)}
            this.hitbox.shareBlacklist(this.user.getBlacklist());
            addEntity(this.hitbox);
            addDrawable(this.trailDrawable);
        }
        
        if(this.phase >= this.startlag && this.phase <= this.slashDuration + this.startlag) {
            let positionTransition = new ColorTransition(this.lastPositionM || userPositionM, userPositionM);
            
            for(let i = 1; i <= this.det; ++i) {
                let progress = (this.phase - this.startlag - 1+i/this.det) / this.slashDuration;
                
                if(progress >= 0) {
                    let baseAngle = this.baseAngleTransition.at(progress)[0];
                    
                    let baseDistance = this.baseDistanceTransition.at(progress)[0];
                    let baseDirection = new Vector(Math.cos(baseAngle), Math.sin(baseAngle));
                    
                    let basePosition = Vector.addition(positionTransition.at(i/this.det), baseDirection.normalized(baseDistance));
                    
                    let bladeAngle = this.bladeAngleTransition.at(progress)[0];
                    let bladeWidth = this.bladeWidthTransition.at(progress)[0];
                    
                    let bladeDirection = (new Vector(Math.cos(bladeAngle), Math.sin(bladeAngle))).normalize(bladeWidth);
                    
                    this.hitbox.setSize([bladeWidth, bladeWidth]);
                    this.hitbox.setPositionM(basePosition.plus(bladeDirection.divided(2)));
                    
                    this.updateTrailDrawableStyle(i/this.det);
                    
                    let edgeWidth = this.edgeWidthTransition.at(progress)[0];
                    
                    this.trailDrawable.addSized(basePosition, bladeAngle, bladeWidth, bladeWidth - edgeWidth);
                }
            }
            
            this.lastPositionM = userPositionM;
        }
        
        if(this.phase == this.startlag + this.slashDuration + this.endlag) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
    
    use() {
        return this.slashUpdate();
    }
    
    onend() {
        this.user.removeState("attack");
        
        return super.onend();
    }
}

class SpeechAction extends Action {
    constructor(content = randomText()) {
        super();
        this.setId("speech");
        
        this.content = content;
        this.speechSpeed = 0.25;
        this.speechIndex = 0;
        
        this.textBubble = new TextBubble([NaN, NaN], [64, 40]);
        
        this.endlag = 32;
        this.endTimeout = -1;
    }
    
    use() {
        this.textBubble.setXM(this.user.getXM());
        this.textBubble.setY2(this.user.getY1() - 16);
        
        if(this.phase === 0) {
            addEntity(this.textBubble);
        }
        
        let speechIndex = Math.floor(this.speechIndex);
        
        this.textBubble.setContent(this.content.substring(0, speechIndex));
        
        this.speechIndex += this.speechSpeed;
        
        if(this.speechIndex >= this.content.length) {
            this.speechIndex = this.content.length - 1;
            
            if(this.endTimeout === -1) {
                this.endTimeout = this.endlag;
            }
        }
        
        if(this.endTimeout > 0) {
            --this.endTimeout;
        } if(this.endTimeout === 0) {
            this.end();
        }
        
        return this;
    }
    
    onend() {
        removeEntity(this.textBubble);
        
        return this;
    }
}

AC["speech"] = SpeechAction;
