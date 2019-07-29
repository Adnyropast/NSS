
const AS_CUTTER = set_gather("cutterBoomerang", "cutterDash", "finalCutter");

class CutterAbility extends BusyAction {
    constructor() {
        super();
    }
}

class Cutter extends Entity {
    constructor() {
        super(...arguments);
        
        // this.setStyle("cyan");
        this.addInteraction(new TypeDamager({"type" : FX_SHARP, "value" : 1}));
        // this.addInteraction(new ContactVanishRecipient());
        
        this.addActset(AS_MOVEMENT);
        
        this.trailDrawable = new TrailDrawable();
        this.angle = 0;
        
        this.previousPositionM = null;
        
        this.setLifespan(64);
        
        let t = 0;
        
        this.controller = function controller(entity) {
            ++t;
            
            if(t % 24 == 0) {
                this.addInteraction(new TypeDamager({"type" : FX_SHARP, "value" : 1}));
            }
        };
    }
    
    updateDrawable() {
        let positionM = this.getPositionM();
        
        let positionTransition = new ColorTransition(positionM, positionM);
        
        if(this.previousPositionM != null) {positionTransition = new ColorTransition(this.previousPositionM, positionM)}
        
        let det = 12;
        
        for(let i = 0; i < det; ++i) {
            this.angle += 2*Math.PI/6/det;
            
            let closePoint = positionTransition.at((i+1)/det);
            
            let farWidth = Math.cos(this.angle) * 2 + 8;
            
            this.trailDrawable.addSized(closePoint, this.angle, farWidth, farWidth - 1);
        }
        
        this.previousPositionM = positionM;
        
        return super.updateDrawable();
    }
    
    onadd() {
        addDrawable(this.trailDrawable);
        
        return super.onadd();
    }
    
    onremove() {
        removeDrawable(this.trailDrawable);
        
        return super.onremove();
    }
}

class CutterBoomerang extends CutterAbility {
    constructor() {
        super();
        this.setId("cutterBoomerang");
    }
    
    use() {
        if(this.phase < 10) {
            
        }
        if(this.phase == 10) {
            var boomerang = Cutter.fromMiddle(this.user.getPositionM(), [16, 8]);
            let speed = Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).normalize(8);
            
            boomerang.setSpeed(speed);
            boomerang.route = this.user.getPositionM();
            boomerang.addAction(new LinearMovement(speed.normalized(-0.5)));
            boomerang.shareBlacklist(this.user.getBlacklist());
            
            addEntity(boomerang);
            
            this.end();
        }
        
        return this;
    }
}

class CutterDash extends CutterAbility {
    constructor() {
        super();
        this.setId("cutterDash");
        
        this.direction = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.direction = Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).normalize(this.user.thrust * 2);
        }
        if(this.phase < 16) {
            this.user.drag(this.direction);
        }
        
        if(this.phase == 24) {
            this.end();
        }
        
        return this;
    }
}

class FinalCutter extends CutterAbility {
    constructor() {
        super();
        this.setId("finalCutter");
    }
    
    use() {
        return this;
    }
}
