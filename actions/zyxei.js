
const AS_ZYXEI = gather("zyxeiFlurry", "rocketPunch", "multi-aimShots");

class ZyxeiAbility extends BusyAction {
    constructor() {
        super();
        this.setAbilityId("zyxei");
    }
}

class ZyxeiFlurry extends ZyxeiAbility {
    constructor() {
        super();
        this.setId("zyxeiFlurry");
        this.setUseCost(10);
    }
    
    use() {
        if(this.getUseCost() >= this.user.getEnergy()) {
            return this.end();
        }
        
        this.phase %= 2 * Math.PI;
        
        this.user.addAction(new Still());
        
        var hitbox = Entity.fromMiddle(this.user.getPositionM(), [8, 8]).setStyle(new TransitionColor([255, 255, 0, 1], [0, 255, 255, 0.25], 16));
        hitbox.setOffense("zyxei", 1);
        hitbox.setBlacklist(this.user.getBlacklist());
        
        hitbox.setSpeed(Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).rotate(Math.sin(this.phase) * 0.25).normalize(4));
        
        hitbox.setLifespan(16);
        hitbox.setSelfBrake(1.09375);
        addEntity(hitbox);
        
        
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Still);
        
        return this;
    }
}

class RocketPunchProjectile extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setStyle(IMG_FIST_LEFT);
        this.setBlockable(true);
        this.setBrakeExponent(0);
        this.setForceFactor(0);
        this.setRegeneration(-1);
        this.setOffense(FX_PIERCING, 16);
        
        this.addPossibleAction(BackSmoke);
        
        this.addAction(new BackSmoke());
    }
}

class RocketPunch extends ZyxeiAbility {
    constructor() {
        super();
        this.setId("rocketPunch");
    }
    
    use() {
        if(this.phase == 16) {
            var projectile = RocketPunchProjectile.fromMiddle([this.user.getPositionM(0), this.user.getPositionM(1)], [32, 32]);
            projectile.setZIndex(-97);
            projectile.setSpeed(Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).normalize(8));
            projectile.setForce(projectile.speed.times(2));
            projectile.setBlacklist(this.user.getBlacklist());
            projectile.setLifespan(24);
            
            addEntity(projectile);
        } else if(this.phase > 32) {
            this.end();
        }
        
        return this;
    }
}

class MultiaimShots extends ZyxeiAbility {
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
            projectile.setBlacklist(this.user.getBlacklist());
            projectile.setLifespan(30);
            addEntity(projectile);
        }
        
        return this;
    }
}
