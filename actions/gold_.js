
const AS_GOLD = set_gather("goldFlurry", "rocketPunch", "multi-aimShots");

class GoldAbility extends BusyAction {
    constructor() {
        super();
    }
}

class GoldSolid extends Hitbox {
    constructor(position, size) {
        super(position, size);
        
        this.setDrawable(PolygonDrawable.from(flameparticle).multiplySize(1/4));
        this.drawable.setPositionM(this.getPositionM());
        this.setStyle(new ColorTransition([255, 255, 0, 1], [0, 255, 255, 0.75], 16));
        // this.setOffense("gold", 1);
        this.setLifespan(16);
        this.setSelfBrake(1.09375);
        
        this.addInteraction(new TypeDamager([{"type" : FX_GOLD_, "value" : 1}]));
        this.addInteraction(new ContactVanishRecipient(1));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(1/1.025);
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
}

class GoldFlurry extends GoldAbility {
    constructor() {
        super();
        this.setId("goldFlurry");
        
        this.setUseCost(1);
    }
    
    use() {
        if(this.user.getEnergy() <= this.getUseCost()) {
            return this.end();
        }
        
        this.phase %= this.phaseLimit;
        this.t = this.phase % (2 * Math.PI);
        
        if(this.phase % 8 == 0) {
            this.user.hurt(this.getUseCost());
            
            var hitbox = GoldSolid.fromMiddle(this.user.getPositionM(), [8, 8]);
            hitbox.shareBlacklist(this.user.getBlacklist());
            
            hitbox.setSpeed(this.user.getCursorDirection().rotate(Math.sin(this.t) * 0.25).normalize(4));
            hitbox.addInteraction(new DragActor(hitbox.speed.normalized(0.25)));
            
            addEntity(hitbox);
        }
        
        return this;
    }
    
    onadd() {
        this.user.addAction(new Still());
        
        return super.onadd();
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Still);
        
        return this;
    }
}

class RocketPunchProjectile extends Projectile {
    constructor(position, size) {
        super(position, size);
        this.setStyle(IMG_FIST_LEFT);
        this.setDrawable(PolygonDrawable.from(flameparticle).multiplySize(1/2));
        this.drawable.setPositionM(this.getPositionM());
        this.setStyle(new ColorTransition([255, 255, 255, 1], [0, 255, 255, 0.5], 24));
        // this.setBrakeExponent(0);
        // this.setForceFactor(0);
        // this.setRegeneration(-1);
        // this.setOffense(FX_PIERCING, 16);
        
        this.setZIndex(-97);
        this.setLifespan(24);
        
        this.addInteraction(new TypeDamager([{"type" : FX_GOLD_, "value" : 4}]));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
}

class RocketPunch extends GoldAbility {
    constructor() {
        super();
        this.setId("rocketPunch");
        
        this.setUseCost(2);
    }
    
    use() {
        if(this.user.getEnergy() <= this.getUseCost()) {
            return this.end();
        }
        
        if(this.phase == 0) {
            this.user.hurt(this.getUseCost());
        }
        
        if(this.phase == 16) {
            var projectile = RocketPunchProjectile.fromMiddle([this.user.getPositionM(0), this.user.getPositionM(1)], [8, 8]);
            
            projectile.setSpeed(this.user.getCursorDirection().normalize(8));
            // projectile.setForce(projectile.speed.times(2));
            projectile.addInteraction(new DragActor(projectile.speed.times(1)));
            projectile.shareBlacklist(this.user.getBlacklist());
            
            addEntity(projectile);
            
            this.user.setFace(projectile.speed[0]);
            
            this.user.hurt(this.getUseCost());
        } else if(this.phase > 16) {
            this.end();
        }
        
        return this;
    }
}

class MultiaimShots extends GoldAbility {
    constructor() {
        super();
        this.setId("multi-aimShots");
    }
    
    use() {
        var x = this.user.getXM(), y = this.user.getYM();
        
        console.log(this.user.cursor.targets);
        
        for(var i = 0; i < this.user.cursor.collidedWith.length; ++i) {
            var projectile = Projectile.fromMiddle([x, y], [16, 16]);
            projectile.speed = Vector.subtraction(this.user.cursor.collidedWith[i].getPositionM(), this.user.getPositionM()).normalize(8);
            projectile.shareBlacklist(this.user.getBlacklist());
            projectile.setLifespan(30);
            addEntity(projectile);
        }
        
        return this;
    }
}
