
class HitboxTrail extends Entity {
    update() {
        // console.log(this.i);
        
        return super.update();
    }
}

class HitboxTrailing extends Action {
    constructor() {
        super();
        this.setId("hitboxTrail");
        
        this.lastPosition = null;
        this.i = 0;
    }
    
    use() {
        // console.log("trailing");
        /**
        let t = Entity.fromMiddle(this.user.getPositionM(), [64, 64]);
        t.setStyle("#007F7F7F");
        t.setLifespan(3);
        addEntity(t);
        /**/
        if(this.lastPosition != null) {
            var currentPosition = this.user.getPositionM();
            // console.log(this.lastPosition, currentPosition);
            
            var vector = Vector.subtraction(this.lastPosition, currentPosition);
            var distance = vector.getNorm();
            var length = Vector.distance(this.user.pointAt(vector.getAngle()), this.user.getPositionM());
            var step = 0;
            
            while(distance > step) {
                var trail = Bullet.fromMiddle(Vector.addition(currentPosition, vector.unit(step)), this.user.getSize());
                trail.setLifespan(0);
                trail.setStyle("rgba(" + (this.phase / 2 * 255) + ", 255, " + (step * 255 / distance) + ", 255)");
                trail.i = this.i++;
                trail.removeActionsWithConstructor(HitboxTrailing);
                trail.shareBlacklist(this.user.getBlacklist());
                
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

class Bullet extends Hitbox {
    constructor(position, size) {
        super(position, size);
        
        this.setTypeOffense(FX_PIERCING, 1);
        this.addInteraction(new TypeDamager());
        
        this.addActset("hitboxTrail");
        this.addAction(new HitboxTrailing());
    }
}

class BulletShot extends Action {
    use() {
        if(this.phase == 0) {
            var bullet = Bullet.fromMiddle(this.user.getPositionM(), [2, 2]);
            bullet.setSpeed(this.user.getCursorDirection().normalize(128));
            bullet.setLifespan(10);
            
            bullet.shareBlacklist(this.user.getBlacklist());
            
            addEntity(bullet);
        } else if(this.phase == 5) {
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

EC["adnyropast"] = class Adnyropast extends PlayableCharacter {
    constructor(position, size) {
        super(position, size);
        // this.setRegeneration(0.0625);
        // this.addAction(new Regeneration(0.0625));
        
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
    
    addAction(action) {
        action.setUseCost(0);
  
        return super.addAction(action);
    }
};
