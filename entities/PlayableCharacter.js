
class Character extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setCollidable(true);
        this.setBlockable(true);
        this.setReplaceable(true);
        
    }
}

class PlayableCharacter extends Character {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.collidable = true;
        this.blockable = true;
        this.setReplaceable(true);
        this.resetEnergy(100);
        this.setEffectFactor("default", 1);
        
        this.cursor = new Cursor(this.getPositionM(0), this.getPositionM(1), 256, 256);
        this.cursor.setBlacklist(this.getBlacklist());
        this.cursor.setStyle("#00FFFF3F");
        addEntity(this.cursor);
        
    }
    
    update() {
        super.update();
        
        return this;
    }
}

class Cursor extends Entity {
    constructor(xm, ym, width, height) {
        super(xm - width / 2, ym - height / 2, width, height);
        this.setCollidable(true);
        this.setSelfBrake(1.25);
        
        this.target = null;
        this.detect = function detect(other) {
            return other instanceof Enemy;
        };
    }
    
    centerTarget() {
        if(this.target != null) {
            this.setPositionM(this.target.getPositionM());
        }
        
        return this;
    }
    
    setDetectFunction(detect) {
        this.detect = detect;
        
        return this;
    }
    
    oncollision(other) {
        if(typeof this.detect == "function" && this.detect(other)) {
            this.target = other;
        }
        
        return this;
    }
}

class EnemyCursor extends Cursor {
    constructor(xm, ym, width, height) {
        super(xm, ym, width, height);
        
        this.detect = function detect(other) {
            return other instanceof PlayableCharacter;
        };
    }
}

class Enemy extends Character {
    constructor(x, y, width, height) {
        super(x, y, width, height).setStyle("#7F007F");
        this.setOffense("default", 1);
        
        this.cursor = (new EnemyCursor(this.getXM(), this.getYM(), 256, 256)).setStyle("#FF7FFF5F");
        this.cursor.setBlacklist(this.getBlacklist());
        addEntity(this.cursor);
        
        this.cursorDistance = 256;
        
        this.setRegeneration(0.0625);
    }
    
    update() {
        if(this.cursor.target == null) {
            this.cursor.setPositionM(this.getPositionM());
            this.route = null;
        } else {
            if(Vector.distance(this.cursor.target.getPositionM(), this.getPositionM()) < this.cursorDistance) {
                this.cursor.centerTarget();
                this.route = this.cursor.getPositionM();
            } else {
                this.cursor.setTarget(null);
            }
        }
        
        this.addAction(new Movement(0.25));
        
        super.update();
        
        return this;
    }
}
