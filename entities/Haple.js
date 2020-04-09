
class Haple extends PlayableCharacter {
    constructor(position, size = [8, 16]) {
        super(position, size);
        
        const battler = HapleBattler.fromEntity(this);
        battler.setSpeedPriority(1);
        this.setBattler(battler);
        
        this.anim = IMGCHAR["Haple"];
        
        this.setDrawable(RectangleDrawable.from(this));
        this.drawable.setSize([16, 16]);
        
        this.setStats({
            "walk-speed": new ScaleValue(0.5),
            "walk-speed-tired" : new ScaleValue(0.375),
            "air-speed" : new ScaleValue(0.5),
            "air-speed-tired" : new ScaleValue(0.4921875),
            "swim-speed" : new ScaleValue(0.5),
            "swim-speed-tired" : new ScaleValue(0.375),
            
            "climb-speed" : new ScaleValue(1),
            "jump-force" : 1.5,
            "regeneration" : 0.0625,
            
            "walljump-angle" : 0.2617993877991494,
            "walljump-force" : 1.9375,
            
            "midairJump-count" : 1
        });
        
        this.setEventListener("defeat", "vanish", function() {
            const positionM = this.getPositionM();
            
            entityExplode.initialAngle = Math.random() * 2*Math.PI / 8;
            entityExplode(8, StarParticle, positionM, Vector.multiplication(this.size, 1.25), 3);
            
            entityExplode.initialAngle = Math.random() * 2*Math.PI / 8;
            entityExplode(irandom(8, 16), StarParticle2, positionM, undefined, 1)
            .forEach(function(entity) {
                entity.speed.multiply(6);
            });
        });
        
        this.setBasicActionParams(AS_GOLD, AS_CUTTER, AS_SWORD, "ZoneEngage", AS_FIRE, AS_PLASMA, AS_ARTIST, "SpeechAction");
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
                    // DEBUG.log(JSON.stringify(this.actions[i].getClassName()));
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
}
