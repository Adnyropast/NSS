
class HitboxTrail extends Entity {
    update() {
        // console.log(this.i);
        
        return super.update();
    }
}

class HitboxTrailing extends Action {
    constructor() {
        super();
        this.lastPosition = null;
        this.i = 0;
    }
    
    use() {
        // console.log("trailing");
        
        if(this.lastPosition != null) {
            // console.log(this.user.getPositionM());
            
            var currentPosition = this.user.getPositionM();
            // console.log(currentPosition);
            
            var vector = Vector.subtraction(this.lastPosition, currentPosition);
            var distance = vector.getNorm();
            var length = Vector.distance(this.user.pointAt(vector.getAngle()), this.user.getPositionM());
            var step = 0;
            
            while(distance > step) {
                var trail = Bullet.fromMiddle(Vector.addition(currentPosition, vector.unit(step)), this.user.getSize());
                trail.setLifespan(0);
                trail.setStyle("rgba(" + (this.phase / 2 * 255) + ", 255, " + (step * 255 / distance) + ", 255)");
                trail.i = this.i++;
                trail.setBlacklist(this.user.getBlacklist());
                
                addEntity(trail);
                
                // console.log("%c" + trail.positionM, "background : " + trail.style + ";");
                step += length;
            }
            
            var trails = [];
        }
        
        
        this.lastPosition = this.user.getPositionM();
        
        return this;
    }
}

class Bullet extends Entity {
    constructor(position, size) {
        super(position, size);
        
        this.setOffense(FX_PIERCING, 1);
    }
}

class BulletShot extends Action {
    use() {
        if(this.phase == 0) {
            var bullet = Bullet.fromMiddle(this.user.getPositionM(), [2, 2]);
            bullet.setSpeed(Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).normalize(128));
            bullet.setLifespan(3);
            bullet.addPossibleAction(HitboxTrailing);
            bullet.addAction(new HitboxTrailing());
            bullet.setBlacklist(this.user.getBlacklist());
            
            addEntity(bullet);
        } else if(this.phase == 3) {
            this.end();
        }
        
        // console.log(ENTITIES);
        
        return this;
    }
    
    onadd() {
        // repaceLoop(1000);
        
        return super.onadd();
    }
    
    onend() {
        repaceLoop(WORLD_PACE);
        
        return super.onend();
    }
}

class Adnyropast extends PlayableCharacter {
    constructor(position, size) {
        super(position, size);
        this.setRegeneration(0.0625);
        
        this.cursorDistance = 32;
        
        this.addInteraction(new ReplaceRecipient());
    }
    
    updateDrawable() {
        this.setStyle("rgb(255, " + (this.getEnergyRatio() * 255) + ", 0)");
        
        return super.updateDrawable();
    }
    
    canUseAction() {
        return true;
    }
}
