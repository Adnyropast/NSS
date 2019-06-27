
const AS_SWORD = gather("overheadSlash");

class SwordAbility extends BusyAction {
    constructor() {
        super();
        this.setAbilityId("sword");
    }
}

class SlashEffect extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setOffense(FX_SHARP, 1);
    }
    
    updateDrawable() {
        var grd = CANVAS.getContext("2d").createLinearGradient(0, 0, 0, this.getHeight());
        grd.addColorStop(0, "#00FFFF00");
        grd.addColorStop(1, "#00FFFFBF");
        
        this.setStyle(grd);
        this.setStyle(INVISIBLE);
        
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setSizeM(this.getSize());
        
        return this;
    }
}

class SlashDrawable extends PolygonDrawable {
    constructor(points) {
        super(points);
        
        this.setStyle(new TransitionColor([0, 255, 255, 1], [0, 255, 255, 0], 12, bezierLinear));
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
        
        this.effects = [];
        
        this.path = [];
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
            
            var farX = this.user.getXM() + Math.cos(angle) * 24;
            var farY = this.user.getYM() + Math.sin(angle) * 24;
            
            this.effect.setPositionM(0, farX);
            this.effect.setPositionM(1, farY);
            
            farX = this.user.getXM() + Math.cos(angle) * 32;
            farY = this.user.getYM() + Math.sin(angle) * 32;
            
            var closeX = this.user.getXM() + Math.cos(angle) * 12;
            var closeY = this.user.getYM() + Math.sin(angle) * 12;
            
            this.path.push({far : [farX, farY], close : [closeX, closeY]});
            
            if(this.phase > 0) {
                var last = this.path[this.path.length - 2];
                var current = this.path[this.path.length - 1];
                
                var drawable = new SlashDrawable([last.far, current.far, current.close, last.close]);
                
                addDrawable(drawable);
                this.effects.push(drawable);
            }
        } else if(this.phase > 22) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
    
    onend() {
        for(var i = 0; i < this.effects.length; ++i) {
            removeDrawable(this.effects[i]);
        }
        
        return super.onend();
    }
}
