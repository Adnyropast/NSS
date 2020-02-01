
EC["haple"] = class Haple extends PlayableCharacter {
    constructor(position, size = [8, 16]) {
        super(position, size);
        // this.setRegeneration(0.0625);
        // this.addAction(new Regeneration(0.0625));
        
        this.addActset(AS_GOLD, AS_CUTTER, AS_SWORD, "zoneEngage", AS_FIRE, AS_PLASMA, AS_ARTIST, "speech");
        
        this.setBattler(HapleBattler.fromEntity(this));
        
        this.anim = IMGCHAR["haple"];
        
        this.setDrawable(RectangleDrawable.from(this));
        this.drawable.setSize([16, 16]);
        
        this.setStats({
            "walk-speed" : 0.5,
            "walk-speed-tired" : 0.375,
            "air-speed" : 0.5,
            "air-speed-tired" : 0.5-Math.pow(2, -7),
            "swim-speed" : 0.5,
            "swim-speed-tired" : 0.375,
            
            "climb-speed" : 1,
            "jump-force" : 1.5,
            "regeneration" : 0.0625,
            
            "walljump-angle" : 0.2617993877991494,
            "walljump-force" : 1.9375,
            
            "midairJump-count" : 1
        });
        
        this.setEventListener("defeat", "vanish", function() {
            let count = 8;
            let positionM = this.getPositionM();
            
            for(let i = 0; i < count; ++i) {
                let angle = i / count * 2*Math.PI;
                
                let particle = HapleVanishParticle.fromMiddle(positionM, Vector.multiplication(this.size, 2));
                
                particle.setSpeed((new Vector(Math.cos(angle), Math.sin(angle))).normalize(Math.random()+3));
                
                addEntity(particle);
            }
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
            DEBUG.clear();
            
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
        console.log(this.getViewType() + " walk", event);
        
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
        console.log(this.getViewType() + " swim", event);
        
        return this;
    }
    
    ondrift(event) {
        console.log(this.getViewType() + " drift", event);
        
        return this;
    }
    
    onclimb(event) {
        console.log(this.getViewType() + " climb", event);
        
        return this;
    }
    
    oncrouch(event) {
        console.log("crouch", event);
        
        return this;
    }
    
    onlookup(event) {
        console.log("lookup", event);
        
        return this;
    }
};

class HapleVanishParticle extends Particle {
    constructor() {
        super(...arguments);
        
        this.setLifespan(32);
        this.setDrawable(PolygonDrawable.from(makeStarPolygon()).multiplySize(rectangle_averageSize(this)/16));
        this.drawable.setStyle(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1], 32));
        
        this.setSelfBrake(1.0625);
        
        this.rotationTransition = new ColorTransition([Math.PI/64], [0], 32);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.rotate(this.rotationTransition.getNext()[0]);
        this.drawable.multiplySize(1/1.0625);
        
        return this;
    }
}
