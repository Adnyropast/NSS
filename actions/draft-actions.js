
class TargetAttack extends Action {
    constructor() {
        super();
        
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

function makeBackSmokeController(callbackfn = emptyFn) {
    let t = 0;
    const smokeClass = SmokeParticle;
    
    return function backSmokeController() {
        if(t % 2 === 0 && this.speed.getNorm() > 2) {
            const avgsz = rectangle_averageSize(this);
            
            entityExplode.randomAngleVariation = 1;
            entityExplode(1, smokeClass, this.getPositionM(), [avgsz/2, avgsz/2], avgsz/24)
            .forEach(callbackfn);
        }
        
        ++t;
    };
}

class DashKick extends Action {
    constructor() {
        super();
        
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

class ZoneEngageZone extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(32);
        this.setSizeTransition(new VectorTransition([0, 0], [240, 240], this.getLifespan() - 8, powt(4)));
        
        this.getDrawable()
        .setZIndex(ALMOST_ZERO/8)
        .setStyle(makeRadialGradientCanvas("cyan", "rgba(0, 255, 255, 0)", 256, 256));
        
        this.alphaTransition;
    }
    
    updateDrawable() {
        if(!this.sizeTransition) {
            if(!this.alphaTransition) {
                this.alphaTransition = new NumberTransition(1, 0, this.getLifespan() - this.lifeCounter, powt(0.75));
            }
            
            this.getDrawable().globalAlpha = this.alphaTransition.getNext();
        }
        
        // this.getDrawable().setStyle("rgba(0, 255, 255, " + (this.lifeCounter / this.getLifespan()) + ")");
        
        return this;
    }
}

class ZoneEngageWindbox extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.addInteraction(new VacuumDragActor(-0.5));
        this.setTypeOffense(FX_WIND, 0.5);
        this.removeAutoHitListeners();
        this.addEventListener("hit", function(event) {
            const entities = typeImpacts[FX_WIND](event.actor, event.recipient);
            entities.forEach(function(entity) {
                if(entity instanceof SmokeParticle) {
                    entity.setLifespan(irandom(48, 64));
                    entity.sizeTransition.duration = entity.getLifespan();
                    
                    entity.getDrawable()
                    .setStyle(new ColorTransition([191, 255, 255, 1], [0, 223, 223, 1], entity.getLifespan(), powt(1/2)))
                    .setStrokeStyle(new ColorTransition([0, 191, 191, 1], [0, 159, 191, 1], entity.getLifespan(), powt(1/2)));
                }
                
                else if(entity instanceof OvalWaveParticle) {
                    entity.getDrawable()
                    .setStyle(new ColorTransition([255, 255, 255, 1], [0, 0, 255, 0], entity.getLifespan(), powt(1/2)));
                }
            });
        });
    }
}

class ZoneEngage extends BusyAction {
    constructor() {
        super();
        
        this.targets = new SetArray();
        
        this.duration = 32;
        
        this.opponentFound = false;
        this.endTime = 32;
    }
    
    use() {
        if(this.phase === 0) {
            const action = this;
            const user = this.user;
            
            const positionM = this.user.getPositionM();
            
            const zone = ZoneEngageZone.fromMiddle(positionM, [0, 0]);
            const wind = ZoneEngageWindbox.shared(zone);
            
            zone.controllers.add(function samePositionAsUser() {
                this.setPositionM(user.getPositionM());
            });
            
            zone.addEventListener("remove", function zoneEngageEnd() {
                for(let i = 0; i < action.targets.length; ++i) {
                    if(user.opponents.includes(action.targets[i])) {
                        action.opponentFound = true;
                    }
                }
                
                removeEntity(wind);
                
                if(action.opponentFound) {
                    
                }
            });
            
            zone.addEventListener("collision", function recordBattlers(other) {
                if(other.isBattler()) {
                    action.targets.add(other);
                }
            });
            
            wind.shareBlacklist(this.user.getBlacklist());
            
            wind.addEventListener("hit", function opponentHitEffect(event) {
                const recipient = event.recipient;
                
                if(user.opponents.includes(recipient)) {
                    action.endTime = 72;
                    const remTime = action.endTime - zone.lifeCounter;
                    
                    const background = (new RectangleDrawable([0, 0], [CANVAS.width, CANVAS.height])).setCameraMode("none");
                    background.setLifespan(remTime);
                    background.setZIndex(+1);
                    background.setStyle(new ColorTransition([0, 255, 255, 0.125], [0, 255, 255, 1], Math.min(8, background.getLifespan() - 1), powt(1/4)));
                    
                    addDrawable(background);
                    
                    recipient.stun(remTime);
                    entityShake(recipient, 4);
                }
            });
            
            addEntity(zone);
            addEntity(wind);
            
            this.setRemovable(false);
        }
        
        if(this.phase === this.endTime) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
    
    onend() {
        if(this.endId === 0 && this.opponentFound) {
            engageBattle(this.targets);
        }
        
        return super.onend();
    }
}

class Summon extends Action {
    constructor(entity) {
        super();
        
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

class StunState extends BusyAction {
    constructor(timeout = 1) {
        super();
        
        this.brakeRecipientSave = null;
        this.timeout = timeout;
        
        this.backSmoke = new BackSmoke();
        this.backSmokeController = makeBackSmokeController();
    }
    
    onadd() {
        this.user.addStateObject({"name" : "hurt", "countdown" : this.timeout});
        this.brakeRecipientSave = this.user.findInterrecipientWithId("brake");
        this.user.removeInterrecipientWithId("brake");
        this.setRemovable(false);
        
        this.user.setSelfBrake(1.125);
        
        // this.user.addAction(this.backSmoke);
        // this.user.controllers.add(this.backSmokeController);
        
        return super.onadd();
    }
    
    onend() {
        this.user.addInteraction(this.brakeRecipientSave);
        
        this.user.setSelfBrake(1);
        
        // this.user.removeAction(this.backSmoke);
        // this.user.controllers.remove(this.backSmokeController);
        
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
    
    allowsReplacement(action) {
        return action instanceof StunState && action.timeout > this.timeout;
    }
}

class SlashAction extends BusyAction {
    constructor() {
        super();
        
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
            
            if(this.user.spendEnergy(this.getUseCost())) {
                this.setRemovable(false);
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
