
EC["haple"] = class Haple extends PlayableCharacter {
    constructor(position, size = [8, 16]) {
        super(position, size);
        
        this.addActset(AS_GOLD, AS_CUTTER, AS_SWORD, "zoneEngage", AS_FIRE, AS_PLASMA, AS_ARTIST, "speech");
        
        const battler = HapleBattler.fromEntity(this);
        battler.setSpeedPriority(1);
        this.setBattler(battler);
        
        this.anim = IMGCHAR["haple"];
        
        this.setDrawable(RectangleDrawable.from(this));
        this.drawable.setSize([16, 16]);
        
        this.setStats({
            "walk-speed.real" : 0.5,
            "walk-speed.effective" : 0.5,
            "walk-speed-tired.effective" : 0.375,
            "air-speed.effective" : 0.5,
            "air-speed-tired.effective" : 0.5-Math.pow(2, -7),
            "swim-speed.effective" : 0.5,
            "swim-speed-tired.effective" : 0.375,
            
            "climb-speed.effective" : 1,
            "jump-force" : 1.5,
            "regeneration" : 0.0625,
            
            "walljump-angle" : 0.2617993877991494,
            "walljump-force" : 1.9375,
            
            "midairJump-count" : 1
        });
        
        this.setEventListener("defeat", "vanish", function() {
            const positionM = this.getPositionM();
            
            entityExplode.initialAngle = Math.random() * 2*Math.PI / 8;
            entityExplode(8, HapleVanishParticle, positionM, Vector.multiplication(this.size, 1.25), 3);
            
            entityExplode.initialAngle = Math.random() * 2*Math.PI / 8;
            entityExplode(irandom(8, 16), HapleVanishParticle2, positionM, undefined, 1)
            .forEach(function(entity) {
                entity.speed.multiply(6);
            });
            
            entityExplode.initialAngle = 0;
        });
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.drawableOffset.plus(this.getPositionM()));
        
        this.drawableOffset[0] = 0;
        
        return super.updateDrawable();
    }
    
    update() {
        super.update();
        
        if(this.lifeCounter % 1 === 0) {
            // DEBUG.clear();
            
            for(let i in this.state) {
                try {
                    // DEBUG.log(JSON.stringify(this.state[i]));
                } catch(e) {
                    
                }
            }
            
            if(this.route != null) {
                // DEBUG.log(this.route[0]);
                // DEBUG.log(this.route[1]);
            }
            
            for(let i = 0; i < this.actions.length; ++i) {
                try {
                    // DEBUG.log(JSON.stringify(this.actions[i].id));
                } catch(e) {
                    
                }
            }
        }
        
        return this;
    }
    
    onwalk(event) {
        // console.log(this.getViewType() + " walk", event);
        
        return this;
    }
    
    onwalkstart(event) {
        // console.log("walkstart", event);
        
        return this;
    }
    
    onmovementend(event) {
        // console.log("movementend", event);
        
        return this;
    }
    
    onjump(event) {
        // console.log("jump", event);
        this.addState("jumping");
        
        return this;
    }
    
    onswim(event) {
        // console.log(this.getViewType() + " swim", event);
        
        return this;
    }
    
    ondrift(event) {
        // console.log(this.getViewType() + " drift", event);
        
        return this;
    }
    
    onclimb(event) {
        // console.log(this.getViewType() + " climb", event);
        
        return this;
    }
    
    oncrouch(event) {
        // console.log("crouch", event);
        
        return this;
    }
    
    onlookup(event) {
        // console.log("lookup", event);
        
        return this;
    }
};

class HapleVanishParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(32);
        this.setDrawable(PolygonDrawable.from(makeStarPolygon()).multiplySize(rectangle_averageSize(this)/16));
        this.drawable.setStyle(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1], 32, powt(1/2)));
        this.drawable.setShadowBlur(8);
        
        this.setSelfBrake(1.125);
        
        this.rotationTransition = new ColorTransition([Math.PI/64], [0], 32);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.rotate(this.rotationTransition.getNext()[0]);
        this.drawable.multiplySize(1/1.0625);
        
        return this;
    }
}

class HapleVanishParticle2 extends Entity {
    constructor(position, size = [random(2, 4), random(2, 4)]) {
        super(position, size);
        
        this.setLifespan(irandom(16, 64));
        this.addInteraction(new DragRecipient(1));
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new BrakeRecipient());
        
        const avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(makeStarPolygon()).multiplySize(avgsz/16));
        this.drawable.initImaginarySize(avgsz);
        this.drawable.setShadowBlur(8);
        this.drawable.setStyle(new ColorTransition([191, 127, 0, 1], [255, 255, 0, 1], this.lifespan, powt(1/2)));
        
        this.rotationTransition = new NumberTransition(1, 0, this.lifespan, powt(1/4));
        
        this.setSizeTransition(new VectorTransition(Array.from(size), [0, 0], this.lifespan, powt(2)));
    }
    
    updateDrawable() {
        const avgsz = rectangle_averageSize(this);
        
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.rotate(this.rotationTransition.getNext());
        this.drawable.setImaginarySize(avgsz);
        
        return this;
    }
}
