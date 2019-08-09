
const AS_CUTTER = set_gather("cutterBoomerang", "cutterDash", "finalCutter");

class CutterAbility extends BusyAction {
    constructor() {
        super();
    }
}

const cutterdrawable = new PolygonDrawable([[16, 0], [12, 4], [8, 8], [-8, 16], [0, 0], [-8, -16], [8, -8], [12, -4]]);

class Cutter extends Entity {
    constructor() {
        super(...arguments);
        
        // this.setStyle("cyan");
        this.addInteraction(new TypeDamager({"type" : FX_SHARP, "value" : 1}));
        this.addInteraction(new ContactVanishRecipient(1));
        
        this.addActset(AS_MOVEMENT);
        
        this.trailDrawable = new TrailDrawable();
        this.angle = 0;
        
        this.previousPositionM = null;
        
        this.setLifespan(64);
        
        let t = 0;
        
        this.controller = function controller(entity) {
            ++t;
            
            if(t % 9 == 0) {
                this.addInteraction(new TypeDamager({"type" : FX_SHARP, "value" : 1}));
            }
        };
        
        this.bladeDrawable = PolygonDrawable.from(cutterdrawable).multiplySize(1/2);
        this.bladeDrawable.setPositionM(this.getPositionM());
        this.bladeDrawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 1], 64));
    }
    
    updateDrawable() {
        let positionM = this.getPositionM();
        
        let positionTransition = new ColorTransition(positionM, positionM);
        
        if(this.previousPositionM != null) {positionTransition = new ColorTransition(this.previousPositionM, positionM)}
        
        let rotation = 2*Math.PI/6;
        let det = 12;
        
        for(let i = 0; i < det; ++i) {
            this.angle += rotation/det;
            
            let closePoint = positionTransition.at((i+1)/det);
            
            let farWidth = Math.cos(this.angle) * 2 + 8;
            
            this.trailDrawable.addSized(closePoint, this.angle, farWidth, farWidth - 1);
        }
        
        this.bladeDrawable.setPositionM(this.getPositionM());
        this.bladeDrawable.rotate(rotation);
        
        this.previousPositionM = positionM;
        
        return super.updateDrawable();
    }
    
    onadd() {
        addDrawable(this.trailDrawable);
        addDrawable(this.bladeDrawable);
        
        return super.onadd();
    }
    
    onremove() {
        removeDrawable(this.trailDrawable);
        removeDrawable(this.bladeDrawable);
        
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
            
            this.user.setFace(speed[0]);
            
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
        this.damageableSave = null;
        this.cutterDamager = new TypeDamager([{"type" : FX_SHARP, "value" : 4}]);
    }
    
    use() {
        if(this.phase == 0) {
            this.direction = Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM()).normalize(this.user.thrust * 4);
            
            this.user.setFace(this.direction[0]);
        }
        if(this.phase < 16) {
            this.user.drag(this.direction.normalize(this.user.thrust * 2));
        }
        
        if(this.phase == 24) {
            this.end();
        }
        
        return this;
    }
    
    onadd() {
        this.damageableSave = this.user.findInterrecipientWithId("typeDamage");
        this.user.removeInterrecipientWithId("typeDamage");
        this.user.addInteraction(this.cutterDamager);
        
        return this;
    }
    
    onend() {
        this.user.addInteraction(this.damageableSave);
        this.user.removeInteractorWithId("typeDamage");
        
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
