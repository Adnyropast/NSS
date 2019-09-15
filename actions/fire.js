
const AS_FIRE = ["flamethrower","burningAttack"];

class FireEffect extends Hitbox {
    constructor() {
        super(...arguments);
        this.setDrawable(makeFireParticle());
        
        this.drawable.multiplySize(1/4);
        this.drawable.setPositionM(this.getPositionM());
        this.setLifespan(24);
        
        this.addInteraction(new DragRecipient(-0.25 * Math.random()));
        this.addInteraction(new TypeDamager({type:FX_FIRE, value:0.125}));
        
        this.setSelfBrake(1.0625);
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new StunActor(1));
    }
    
    updateDrawable() {
        this.drawable.multiplySize(1.0625);
        // this.drawable.stretchM(this.speed.normalized(0.125));
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}

class Flamethrower extends BusyAction {
    constructor() {
        super();
        this.setId("flamethrower");
        
        this.setUseCost(0.5);
        this.setUseCost(4);
    }
    
    use() {
        if(this.getUseCost() > 0.5) {
            this.setUseCost(this.getUseCost()/1.25);
        }
        
        if(this.user.getEnergy() <= this.getUseCost()) {
            return this.end();
        }
        
        this.phase %= this.phaseLimit;
        
        if(this.phase % 2 == 0) {
            let cursorDirection = this.user.getCursorDirection();
            
            let fireEffect = FireEffect.fromMiddle(this.user.getPositionM(), [8, 8]);
            fireEffect.setSpeed(cursorDirection.normalized(4));
            fireEffect.shareBlacklist(this.user.getBlacklist());
            fireEffect.addInteraction(new DragActor(Vector.from(fireEffect.speed).normalize(0.03125)));
            addEntity(fireEffect);
            
            this.user.setFace(cursorDirection[0]);
            
            this.user.hurt(this.getUseCost());
        }
        
        return this;
    }
}

AC["flamethrower"] = Flamethrower;

class BurningAttack extends BusyAction {
    constructor() {
        super();
        this.setId("burningAttack");
        
        this.setUseCost(16);
        this.saveTypeDamageable = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.setRemovable(false);
        }
        
        if(this.phase == 8) {
            if(this.user.getEnergy() > this.getUseCost()) {
                this.user.addInteraction(new TypeDamager({type:FX_FIRE, value:4}));
                this.user.hurt(this.getUseCost());
                this.saveTypeDamageable = this.user.findInterrecipientWithId("damage");
                this.user.removeInterrecipientWithId("damage");
            } else {
                this.setRemovable(true);
                return this.end();
            }
        }
        
        if(this.phase < 8) {
            
        } else if(this.phase < 32) {
            this.user.setSpeed(this.user.getCursorDirection().normalize(4));
            
            let particle = FireParticle.fromMiddle(this.user.getPositionM(), this.user.getSize());
            particle.drawable.multiplySize((this.user.getWidth() + this.user.getHeight())/2/16);
            particle.drawable.setZIndex(Math.random() - 0.25);
            particle.setSpeed(this.user.speed);
            
            addEntity(particle);
        } else if(this.phase == 48) {
            this.user.removeInteractorWithId("damage");
            this.user.addInteraction(this.saveTypeDamageable);
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
}

AC["burningAttack"] = BurningAttack;
