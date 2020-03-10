
const AS_FIRE = ["flamethrower","burningAttack"];

class FireEffect extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.setLifespan(24);
        
        const positionM = this.getPositionM();
        const avgsz = rectangle_averageSize(this);
        
        for(let i = 0; i < 2; ++i) {
            const drawable = makeFireParticle();
            drawable.setPositionM(positionM);
            drawable.setZIndex(random(-1, 1));
            drawable.multiplySize(avgsz/polygon_averageSize(drawable));
            drawable.initImaginarySize(avgsz);
            
            this.drawables.push(drawable);
        }
        
        this.addInteraction(new DragRecipient(-0.25 * Math.random()));
        
        this.setSelfBrake(1.0625);
        this.addInteraction(new ReplaceRecipient());
        this.setStats({"stun-timeout": 1});
        
        this.setTypeOffense(FX_FIRE, 2);
        
        this.setSizeTransition(new MultiColorTransition([Vector.from(this.size), Vector.multiplication(this.size, random(2, 3)), Vector.multiplication(this.size, random(0, 1/4))], this.lifespan, powt(random(1/4, 4))));
    }
    
    updateDrawable() {
        for(let i = 0; i < this.drawables.length; ++i) {
            const drawable = this.drawables[i];
            
            drawable.setImaginarySize(rectangle_averageSize(this));
            // drawable.stretchM(this.speed.normalized(0.125));
            drawable.setPositionM(this.getPositionM());
            
            drawable.shadowBlur = this.lifespan - this.lifeCounter;
        }
        
        return this;
    }
}

class Flamethrower extends BusyAction {
    constructor() {
        super();
        this.setId("flamethrower");
        
        this.setUseCost(4);
    }
    
    use() {
        if(this.getUseCost() > 0.5) {
            this.setUseCost(this.getUseCost()/1.25);
        }
        
        this.phase %= this.phaseLimit;
        
        if(this.phase % 1 == 0) {
            if(this.user.spendEnergy(this.getUseCost())) {
                let cursorDirection = this.user.getCursorDirection();
                
                let fireEffect = FireEffect.fromMiddle(Vector.addition(this.user.getPositionM(), cursorDirection.normalized(4)), [8, 8]);
                fireEffect.setSpeed(cursorDirection.normalized(random(2, 3)));
                fireEffect.shareBlacklist(this.user.getBlacklist());
                fireEffect.addInteraction(new DragActor(Vector.from(fireEffect.speed).normalize(0.03125)));
                
                if(this.phase % 12 !== 0) {
                    fireEffect.removeInteractorWithId("damage");
                }
                
                addEntity(fireEffect);
                
                this.user.setFace(cursorDirection[0]);
            } else {
                return this.end();
            }
        }
        
        return this;
    }
}

AC["flamethrower"] = Flamethrower;

class BurningHitbox extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.setTypeOffense(FX_FIRE, 4);
        
        this.removeAutoHitListeners();
        
        this.drawable.setStyle(makeRadialGradientCanvas("#FFFF00FF", "#FF000000"));
    }
    
    onhit(event) {
        const actor = event.actor;
        const recipient = event.recipient;
        const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
        
        fireSmokes(irandom(5, 8), middlePosition, bothAvgsz);
        setGameTimeout(function() {
            flamesEffect(3, middlePosition);
            
            setGameTimeout(function() {
                flamesEffect(3, middlePosition);
                fireSmokes(irandom(2, 3), middlePosition, bothAvgsz);
                
                setGameTimeout(function() {
                    flamesEffect(3, middlePosition);
                }, 4);
            }, 4);
        }, 4);
    }
    
    update() {
        super.update();
        
        if(this.lifeCounter % 2 === 0) {
            let particle = FireParticle.fromMiddle(this.getPositionM(), Vector.multiplication(this.getSize(), 1.25));
            particle.drawables.splice(1, Infinity);
            
            addEntity(particle);
        }
        
        return this;
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
    
    onadd() {
        super.onadd();
        
        const positionM = this.getPositionM();
        
        entityExplode.initialAngle = random(0, 2*Math.PI / 8);
        entityExplode.randomAngleVariation = 0.75;
        entityExplode(8, FireSmokeParticle, positionM, [12, 12], 1);
        
        makeShockwave.lineWidth = 4;
        makeShockwave(positionM, 1)
        .setSpeed(Vector.fromAngle(-Math.PI/3).normalize(0.125))
        .makeEllipse([0, 16])
        .getDrawable()
        .setStyle(new ColorTransition([255, 255, 255, 1], [0, 0, 0, 0], 24, powt(2)));
        
        makeShockwave.lineWidth = 4;
        makeShockwave(positionM, 1)
        .setSpeed(Vector.fromAngle(-2*Math.PI/3).normalize(0.125))
        .makeEllipse([0, 16])
        .getDrawable()
        .setStyle(new ColorTransition([255, 255, 255, 1], [0, 0, 0, 0], 24, powt(2)));
        
        return this;
    }
}

class BurningAttack extends BusyAction {
    constructor() {
        super();
        this.setId("burningAttack");
        
        this.setUseCost(16);
        this.saveTypeDamageable = null;
        this.hitbox = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.setRemovable(false);
        }
        
        if(this.phase == 8) {
            if(this.user.spendEnergy(this.getUseCost())) {
                const user = this.user;
                const avgsz = rectangle_averageSize(this.user);
                
                this.hitbox = BurningHitbox.fromMiddle(this.user.getPositionM(), [avgsz, avgsz]);
                this.hitbox.controllers.add(function() {
                    this.setPositionM(user.getPositionM());
                });
                this.hitbox.shareBlacklist(this.user.getBlacklist());
                this.hitbox.order = this.user.order - 1;
                addEntity(this.hitbox);
                
                this.saveTypeDamageable = this.user.findInterrecipientWithId("damage");
                this.user.removeInterrecipientWithId("damage");
                
                removeDrawable(this.user.drawable);
            } else {
                this.setRemovable(true);
                return this.end();
            }
        }
        
        if(this.phase < 8) {
            
        } else if(this.phase < 32) {
            this.user.setSpeed(this.user.getCursorDirection().normalize(4));
        } else {
            removeEntity(this.hitbox);
            addDrawable(this.user.drawable);
            
            // this.user.addInteraction(this.saveTypeDamageable);
        }
        
        if(this.phase == 48) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
    
    onend() {
        removeEntity(this.hitbox);
        this.user.addInteraction(this.saveTypeDamageable);
        
        return super.onend();
    }
}

AC["burningAttack"] = BurningAttack;
