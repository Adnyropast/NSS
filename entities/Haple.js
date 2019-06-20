
const AS_TEST = gather(AS_CUTTER, AS_SWORD);

var K_FLURRY = [70];

class GoldFlurry extends Action {
    constructor() {
        super();
        this.setUseCost(10);
    }
    
    use() {
        if(this.getUseCost() >= this.user.getEnergy()) {
            return this.end();
        }
        
        this.user.addAction(new Still());
        
        var hitbox = (new Entity(NaN, NaN, 16, 16)).setStyle("cyan");
        hitbox.setPositionM(this.user.getPositionM());
        hitbox.setLifespan(30);
        hitbox.setBlacklist(this.user.getBlacklist());
        var vector = Vector.subtraction(this.user.cursor.getPositionM(), this.user.getPositionM());
        var angle = Math.sin(this.phase);
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        hitbox.speed = new Vector(
            cos * vector.getX() - sin * vector.getY(),
            sin * vector.getX() + cos * vector.getY()
        ).normalize(4);
        hitbox.setSelfBrake(1.0625);
        addEntity(hitbox);
        
        console.log(this.user.actions);
        
        return this;
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Still);
        
        return this;
    }
}

class RocketPunchProjectile extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
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

class RocketPunch extends BusyAction {
    use() {
        if(this.phase == 16) {
            var projectile = RocketPunchProjectile.fromMiddle(this.user.getPositionM(0), this.user.getPositionM(1), 32, 32);
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
    
    onadd() {
        console.log("added rocketpunch");
        
        return super.onadd();
    }
}

class MultiaimShots extends Action {
    use() {
        var x = this.user.getXM(), y = this.user.getYM();
        
        console.log(this.user.cursor.targets);
        
        for(var i = 0; i < this.user.cursor.collidedWith.length; ++i) {
            var projectile = Projectile.fromMiddle(x, y, 16, 16);
            projectile.speed = Vector.subtraction(this.user.cursor.collidedWith[i].getPositionM(), this.user.getPositionM()).normalize(8);
            projectile.setBlacklist(this.user.getBlacklist());
            projectile.setLifespan(30);
            addEntity(projectile);
        }
        
        return this;
    }
}

class RunToggle extends Action {
    use() {
        var particle = Particle.fromMiddle(this.user.getXM(), this.user.getYM(), 8, 8).setZIndex(-97);
        particle.setColorTransition([0, 255, 255, 255], [0, 255, 255, 0], 16);
        particle.setLifespan(16);
        
        addEntity(particle);
        
        return this;
    }
}

class Haple extends PlayableCharacter {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setStyle(IMG_HAPLE_STD_RIGHT);
        this.setRegeneration(0.0625);
        
        this.cursorDistance = 32;
        
        this.addPossibleAction([GoldFlurry, RocketPunch, MultiaimShots, ProjectileShot, RunToggle, ZoneEngage]);
        this.addAbilities(["cutter", "sword"]);
        
        this.route = Vector.addition(this.getPositionM(), [1, 0]);
        
        this.faceSave = "right";
    }
    
    updateStyle() {
        var faceDirection = this.cursor.getXM() - this.getXM(0);
        
        if(!this.hasState("grounded")) {
            if(this.speed[1] < 0) {
                // if(this.route[0] > this.getPositionM(0)) {
                if(faceDirection > 0) {
                    this.setStyle(IMG_HAPLE_JUMP_RIGHT);
                    this.faceSave = "right";
                // } else if(this.route[0] < this.getPositionM(0)) {
                } else if(faceDirection < 0) {
                    this.setStyle(IMG_HAPLE_JUMP_LEFT);
                    this.faceSave = "left";
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(IMG_HAPLE_JUMP_RIGHT);
                    } else {
                        this.setStyle(IMG_HAPLE_JUMP_LEFT);
                    }
                }
            } else {
                // if(this.route[0] > this.getPositionM(0)) {
                if(faceDirection > 0) {
                    this.setStyle(IMG_HAPLE_FALL_RIGHT);
                    this.faceSave = "right";
                // } else if(this.route[0] < this.getPositionM(0)) {
                } else if(faceDirection < 0) {
                    this.setStyle(IMG_HAPLE_FALL_LEFT);
                    this.faceSave = "left";
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(IMG_HAPLE_FALL_RIGHT);
                    } else {
                        this.setStyle(IMG_HAPLE_FALL_LEFT);
                    }
                }
            }
        } else if(this.hasState("moving")) {
            if(this.route[0] > this.getPositionM(0)) {
                // console.log("route > position");
                this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                this.faceSave = "right";
            } else if(this.route[0] < this.getPositionM(0)) {
                // console.log("route < position");
                this.setStyle(IMGS_HAPLE_RUN_LEFT);
                this.faceSave = "left";
            } else {
                // console.log("route == position");
                /**
                if(this.faceSave == "right") {
                    this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                } else {
                    this.setStyle(IMGS_HAPLE_RUN_LEFT);
                }
                /**/
                if(faceDirection > 0) {
                    this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                } else if(faceDirection < 0) {
                    this.setStyle(IMGS_HAPLE_RUN_LEFT);
                } else {
                    if(this.faceSave == "right") {
                        this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                    } else {
                        this.setStyle(IMGS_HAPLE_RUN_LEFT);
                    }
                }
            }
        } else {
            if(faceDirection > 0) {
                this.setStyle(IMG_HAPLE_STD_RIGHT);
            } else if(faceDirection < 0) {
                this.setStyle(IMG_HAPLE_STD_LEFT);
            } else {
                if(this.faceSave == "right") {
                    this.setStyle(IMG_HAPLE_STD_RIGHT);
                } else {
                    this.setStyle(IMG_HAPLE_STD_LEFT);
                }
            }
        }
        
        return this;
    }
    
    update() {
        if(this.cursor.targets.length > 0) {
            // console.log(this.cursor.targets.length);
        }
        
        return super.update();
    }
}
