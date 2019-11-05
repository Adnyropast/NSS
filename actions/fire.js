
const AS_FIRE = ["flamethrower","burningAttack"];

class FireEffect extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.setLifespan(24);
        
        let avgsz = rectangle_averageSize(this);
        
        for(let i = 0; i < 2; ++i) {
            let drawable = makeFireParticle();
            drawable.setZIndex(random(-1, 1));
            drawable.multiplySize(avgsz/polygon_averageSize(drawable));
            drawable.initImaginarySize(avgsz);
            
            this.drawables.push(drawable);
        }
        
        this.addInteraction(new DragRecipient(-0.25 * Math.random()));
        // this.addInteraction((new TypeDamager()));
        
        this.setSelfBrake(1.0625);
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new StunActor(1));
        
        this.setTypeOffense(FX_FIRE, 2);
        
        this.setSizeTransition(new MultiColorTransition([Vector.from(this.size), Vector.multiplication(this.size, random(2, 3)), Vector.multiplication(this.size, random(0, 1/4))], this.lifespan, powt(random(1/4, 4))));
    }
    
    updateDrawable() {
        for(let i = 0; i < this.drawables.length; ++i) {
            let drawable = this.drawables[i];
            
            drawable.setImaginarySize(rectangle_averageSize(this));
            // drawable.stretchM(this.speed.normalized(0.125));
            drawable.setPositionM(this.getPositionM());
        }
        
        return this;
    }
}

class Flamethrower extends BusyAction {
    constructor() {
        super();
        this.setId("flamethrower");
        
        this.setUseCost(0.5);
        this.setUseCost(4);
        
        this.typeDamager = (new TypeDamager()).setRehit(6);
    }
    
    use() {
        if(this.getUseCost() > 0.25) {
            this.setUseCost(this.getUseCost()/1.25);
        }
        
        if(this.user.getEnergy() <= this.getUseCost()) {
            return this.end();
        }
        
        this.phase %= this.phaseLimit;
        
        if(this.phase % 2 == 0) {
            let cursorDirection = this.user.getCursorDirection();
            
            let fireEffect = FireEffect.fromMiddle(Vector.addition(this.user.getPositionM(), cursorDirection.normalized(4)), [8, 8]);
            fireEffect.setSpeed(cursorDirection.normalized(random(2, 3)));
            fireEffect.shareBlacklist(this.user.getBlacklist());
            fireEffect.addInteraction(new DragActor(Vector.from(fireEffect.speed).normalize(0.03125)));
            
            if(this.phase % 24 === 0) {
                fireEffect.addInteraction(this.typeDamager);
            }
            
            addEntity(fireEffect);
            
            this.user.setFace(cursorDirection[0]);
            
            this.user.hurt(this.getUseCost());
        }
        
        return this;
    }
}

AC["flamethrower"] = Flamethrower;

class BurningHitbox extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.setTypeOffense(FX_FIRE, 4);
        this.addInteraction(new TypeDamager());
        
        this.events["hit"].push(function(recipient) {
            let actor = this;
            
            setGameTimeout(function() {
                typeImpacts[FX_FIRE](actor, recipient);
                setGameTimeout(function() {
                    typeImpacts[FX_FIRE](actor, recipient);
                    setGameTimeout(function() {
                        typeImpacts[FX_FIRE](actor, recipient);
                    }, 2);
                }, 2);
            }, 2);
        });
    }
}

class BurningAttack extends BusyAction {
    constructor() {
        super();
        this.setId("burningAttack");
        
        this.setUseCost(16);
        this.saveTypeDamageable = null;
        this.saveStunRecipient = null;
        this.hitbox = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.setRemovable(false);
        }
        
        if(this.phase == 8) {
            if(this.user.getEnergy() > this.getUseCost()) {
                this.hitbox = BurningHitbox.shared(this.user);
                this.hitbox.shareBlacklist(this.user.getBlacklist());
                this.hitbox.collide_priority = this.user.collide_priority - 1;
                addEntity(this.hitbox);
                this.user.hurt(this.getUseCost());
                this.saveTypeDamageable = this.user.findInterrecipientWithId("damage");
                this.user.removeInterrecipientWithId("damage");
                this.saveStunRecipient = this.user.findInterrecipientWithId("stun");
                this.user.removeInterrecipientWithId("stun");
            } else {
                this.setRemovable(true);
                return this.end();
            }
        }
        
        if(this.phase < 8) {
            
        } else if(this.phase < 32) {
            this.user.setSpeed(this.user.getCursorDirection().normalize(4));
            
            if(this.phase % 1 === 0) {
                let particle = FireParticle.fromMiddle(this.user.getPositionM(), this.user.getSize());
                particle.drawables.splice(1, Infinity);
                particle.setSpeed(this.user.speed);
                
                addEntity(particle);
            }
        } else if(this.phase == 48) {
            // this.user.removeInteractorWithId("damage");
            
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
    
    onend() {
        removeEntity(this.hitbox);
        this.user.addInteraction(this.saveTypeDamageable);
        this.user.addInteraction(this.saveStunRecipient);
        
        return super.onend();
    }
}

AC["burningAttack"] = BurningAttack;
