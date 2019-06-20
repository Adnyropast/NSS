
class Character extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setCollidable(true);
        this.setBlockable(true);
        this.setReplaceable(true);
        this.setBattler(true);
        this.setZIndex(-100);
        
        this.cursor = Cursor.fromMiddle(this.getXM(), this.getYM(), width, height);
        addEntity(this.cursor);
        
        this.addPossibleAction([FocusAction, Movement]);
    }
    
    onremove() {
        removeEntity(this.cursor);
        
        return super.onremove();
    }
}

class PlayableCharacter extends Character {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.resetEnergy(100);
        this.setEffectFactor("default", 1);
        
        this.cursor.setSizeM([256, 256]).setStyle("#00FFFF5F");
        this.cursor.setBlacklist(this.getBlacklist());
        this.cursor.detect = function detect(other) {
            return other instanceof Enemy || other instanceof Target;
        };
        
        this.addPossibleAction([Jump, BackSmoke]);
        this.addImpossibleAction(MoveFocus);
    }
}

class Cursor extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setCollidable(true);
        this.setSelfBrake(1.25);
        this.setZIndex(-101);
        
        this.target = null;
        this.targets = [];
        this.currentIndex = -1;
        this.detect;
    }
    
    centerTarget() {
        if(this.target != null) {
            this.setPositionM(this.target.getPositionM());
        }
        
        return this;
    }
    
    setNextTarget() {
        if(this.targets.length > 0) {
            ++this.currentIndex;
            this.currentIndex %= this.targets.length;
            
            this.target = this.targets[0];
            this.targets.splice(0, 1);
            // this.setPositionM(this.targets[this.currentIndex].getPositionM());
            
            if(ENTITIES.indexOf(this.target) == -1) {
                this.setNextTarget();
            }
        }
        
        return this;
    }
    
    setDetectFunction(detect) {
        this.detect = detect;
        
        return this;
    }
    
    _oncollision(other) {
        if(typeof this.detect == "function" && this.detect(other)) {
            // this.target = other;
            var index = this.targets.indexOf(other);
            if(index == -1) {
                this.targets.push(other);
            }
        }
        
        return this;
    }
}

class FocusClosest extends FocusAction {
    use() {
        if(this.user.cursor == null) return this.end("no cursor");
        if(this.user.cursor.targets.length == 0) return this.end("no targets");
        
        this.user.cursor.target = this.user.cursor.targets[0];
        var max = Vector.distance(this.user.cursor.target.getPositionM(), this.user.getPositionM());
        
        for(var i = 1; i < this.user.cursor.targets.length; ++i) {
            var distance = Vector.distance(this.user.cursor.targets[i].getPositionM(), this.user.getPositionM());
            
            if(distance < max) {
                max = distance;
                this.user.cursor.target = this.user.cursor.targets[i];
            }
        }
        
        this.user.cursor.centerTarget();
        
        return this;
    }
}

class Enemy extends Character {
    constructor(x, y, width, height) {
        super(x, y, width, height).setStyle("#7F007F");
        this.setEffectFactor("default", 1);
        this.setOffense("default", 1);
        
        this.cursor.setSizeM([256, 256]).setStyle("#FF7FFF5F");
        this.cursor.setBlacklist(this.getBlacklist());
        this.cursor.detect = function detect(other) {
            return other instanceof PlayableCharacter;
        };
        
        this.cursorDistance = 256;
        
        this.setRegeneration(0.0625);
    }
    
    update() {
        var targets = [];
        
        for(var i = 0; i < this.cursor.collidedWith.length; ++i) {
            if(this.cursor.collidedWith[i] instanceof PlayableCharacter) {
                targets.push(this.cursor.collidedWith[i]);
            }
        }
        
        var positionM = this.getPositionM();
        
        this.cursor.target = null;
        var max = this.cursorDistance;
        
        for(var i = 0; i < targets.length; ++i) {
            var distance = Vector.distance(targets[i].getPositionM(), positionM);
            
            if(distance < max) {
                max = distance;
                this.cursor.target = targets[i];
            }
        }
        
        if(this.cursor.target != null) {
            this.addAction(new HoldFocus());
            
            this.route = this.cursor.getPositionM();
            this.addAction(new Movement(0.25));
        } else {
            this.cursor.setPositionM(this.getPositionM());
            this.route = null;
            this.removeActionsWithConstructor(Movement);
            this.removeActionsWithConstructor(HoldFocus);
        }
        
        return super.update();
    }
}
