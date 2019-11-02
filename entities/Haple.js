
EC["haple"] = class Haple extends PlayableCharacter {
    constructor(position, size = [8, 16]) {
        super(position, size);
        // this.setRegeneration(0.0625);
        // this.addAction(new Regeneration(0.0625));
        
        this.cursorDistance = 32;
        
        this.addActset(AS_GOLD, AS_CUTTER, AS_SWORD, "zoneEngage", AS_FIRE, AS_PLASMA, AS_ARTIST);
        
        this.setBattler(HapleBattler.fromEntity(this));
        
        this.anim = IMGCHAR["haple"];
        
        this.setDrawable(RectangleDrawable.from(this));
        this.drawable.setSize([16, 16]);
        
        this.setStats({
            "walk-speed" : 0.5,
            "walk-speed-tired" : 0.25,
            "air-speed" : 0.5,
            "swim-speed" : 0.5,
            
            "climb-speed" : 0.25,
            "jump-force" : 1.5,
            "regeneration" : 0.0625,
            
            "walljump-angle" : 0.2617993877991494,
            "walljump-force" : 1.9375,
            
            "midairJump-count" : 1
        });
    }
    
    static fromData_() {
        let haple = super.fromData(...arguments);
        
        console.log(haple.cursor.position, haple.cursor.size);
        
        return haple;
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.drawableOffset.plus(this.getPositionM()));
        
        this.drawableOffset[0] = 0;
        
        return super.updateDrawable();
    }
    
    onstatewall(wallState) {
        if(wallState.side < 0) {
            this.drawableOffset[0] = -4;
        } else if(wallState.side > 0) {
            this.drawableOffset[0] = +4;
        }
        
        return super.onstatewall(wallState);
    }
    
    ondefeat() {
        let count = 8;
        let positionM = this.getPositionM();
        
        for(let i = 0; i < count; ++i) {
            let angle = i / count * 2*Math.PI;
            
            let particle = HapleVanishParticle.fromMiddle(positionM, Vector.multiplication(this.size, 2));
            
            particle.setSpeed((new Vector(Math.cos(angle), Math.sin(angle))).normalize(Math.random()+3));
            
            addEntity(particle);
        }
        
        return super.ondefeat();
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
