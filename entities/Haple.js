
var K_FLURRY = 70;

class GoldFlurry extends Action {
    use() {
        var hitbox = (new Entity(NaN, NaN, 16, 16)).setStyle("#00FFFF");
        hitbox.setPositionM(this.user.getPositionM());
        hitbox.setLifespan(10);
        hitbox.setBlacklist(this.user.getBlacklist());
        var vector = Vector.subtraction(this.user.cursor.getPositionM(), this.user.getPositionM());
        var angle = Math.sin(this.phase) / 4;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        hitbox.speed = new Vector(
            cos * vector.getX() - sin * vector.getY(),
            sin * vector.getX() + cos * vector.getY()
        ).normalize(8);
        addEntity(hitbox);
        
        if(!keyList.value(K_FLURRY)) {
            this.end();
        }
        
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
        this.setOffense(FX_PIERCING, 1);
        
        this.addAction(new BackSmoke());
    }
}

class RocketPunch extends Action {
    use() {
        if(this.phase == 16) {
            var projectile = RocketPunchProjectile.fromMiddle(this.user.getPositionM(0), this.user.getPositionM(1), 32, 32);;
            projectile.setZIndex(this.user.getZIndex() - 1);
            projectile.speed = Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).normalize(8);
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

class Haple extends PlayableCharacter {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setRegeneration(0.0625);
        
        this.groundCheck = false;
        this.gravityDirection = new Vector(0, 0);
        
        this.cursorDistance = 32;
        
        this.route = this.getPositionM();
    }
    
    oncollision(other) {
        super.oncollision(other);
        
        if(other instanceof Obstacle) {
            this.groundCheck = true;
        }
        
        this.gravityDirection.add(other.force);
        
        return this;
    }
    
    update() {
        var faceDirection = this.cursor.getPositionM(0) - this.getPositionM(0);
        
        if(this.hasState("walking")) {
            if(this.route[0] > this.getPositionM(0)) {
                // console.log("route > position");
                this.setStyle(IMGS_HAPLE_RUN_RIGHT);
                this.faceSave = IMGS_HAPLE_RUN_RIGHT;
            } else if(this.route[0] < this.getPositionM(0)) {
                // console.log("route < position");
                this.setStyle(IMGS_HAPLE_RUN_LEFT);
                this.faceSave = IMGS_HAPLE_RUN_LEFT;
            } else {
                // console.log("route == position");
                if(!this.faceSave) {
                    this.faceSave = IMGS_HAPLE_RUN_RIGHT;
                }
                
                this.setStyle(this.faceSave);
            }
        } else {
            if(faceDirection > 0) {
                this.setStyle(IMG_HAPLE_STD_RIGHT);
            } else {
                this.setStyle(IMG_HAPLE_STD_LEFT);
            }
        }
        
        this.resetState();
        
        super.update();
        
        this.groundCheck = false;
        this.gravityDirection.fill(0);
        
        return this;
    }
}
