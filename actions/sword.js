
const AS_SWORD = gather("overheadSlash");

class SwordAbility extends BusyAction {
    constructor() {
        super();
        this.setAbilityId("sword");
    }
    
    onadd() {
        this.user.removeActionsWithConstructor(Movement);
        
        return this;
    }
    
    preventsAddition(action) {
        return action instanceof Movement;
    }
}

class SlashEffect extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setOffense(FX_SHARP, 1);
    }
    
    updateStyle() {
        var grd = CANVAS.getContext("2d").createLinearGradient(0, 0, 0, this.getHeight());
        grd.addColorStop(0, "#00FFFF00");
        grd.addColorStop(1, "#00FFFFBF");
        
        this.setStyle(grd);
        
        return this;
    }
}

var swords = [];

class OverheadSlash extends SwordAbility {
    constructor() {
        super();
        this.setId("overheadSlash");
        
        this.effect = null;
        this.face = null;
        this.center = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.face = new Vector(Math.sign(this.user.getCursor().getXM() - this.user.getXM()), 0);
            
            if(this.face[0] == 0) {
                return this.end();
            }
            
            this.center = this.user.getPositionM();
            
            this.setRemovable(false);
            
            this.effect = SlashEffect.fromMiddle([this.face.x + this.user.getXM(), this.face.y + this.user.getYM()], [32, 32]);
            this.effect.setLifespan(16);
            this.effect.setBlacklist(this.user.getBlacklist());
            this.effect.setForce(this.face.multiply(2));
            
            addEntity(this.effect);
        } if(this.phase <= 10) {
            var angle = -Math.PI / 2 + (this.phase - 2) * this.face[0] * 0.1875;
            
            var s = 32 - Math.abs(this.phase - 5) * 16 / 5;
            
            this.effect.setSize([s, s]);
            
            this.effect.setPositionM(0, this.user.getXM() + Math.cos(angle) * 24);
            this.effect.setPositionM(1, this.user.getYM() + Math.sin(angle) * 24);
        } else {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
}
