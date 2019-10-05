
const AS_ARTIST = set_gather("brushSlash");

class PaintDroplet extends Entity {
    constructor() {
        super(...arguments);
        
        let avgsz = rectangle_averagesize(this);
        
        this.setDrawable(PolygonDrawable.from(roundparticle));
        this.drawable.setStyle(MultiColorTransition.from(CT_RAINBOW).setDuration(24));
        this.drawable.style.step = irandom(0, 23);
        this.drawable.multiplySize(avgsz/12/irandom(4, 16));
        this.drawable.stretchM([16, 0]);
        this.setLifespan(24);
        
        this.setSelfBrake(1.03125);
        
        this.addInteraction(new DragRecipient(0.03125));
        
        let sizeTransition = new VectorTransition(this.size, [0, 0], this.lifespan, powt(8));
        
        this.controllers.add(function() {
            this.setSizeM(sizeTransition.getNext());
        });
        
        this.drawable.initImaginarySize(avgsz);
    }
    
    updateDrawable() {
        this.drawable.setImaginaryAngle(0);
        if(this.lifeCounter < 14) {this.drawable.shrinkM([-1, 0]);}
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        this.drawable.setImaginarySize(rectangle_averagesize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}

class BrushSlash extends SlashAction {
    constructor() {
        super();
        this.setId("brushSlash");
        
        this.trailDrawable.trailStyle = MultiColorTransition.from(CT_RAINBOW).setDuration(12);
        this.trailDrawable.curveFunction = powt(1/4);
        
        this.hitbox.addInteraction(new TypeDamager());
        
        this.hitbox.offenses = {};
        this.hitbox.setTypeOffense("paint", 1);
    }
    
    transitionsSetup() {
        let direction = this.user.getCursorDirection();
        let angle = direction.getAngle();
        
        this.baseDistanceTransition = new VectorTransition([0], [12], 1, ovalTransition);
        if(Math.floor(Math.random() * 2)) {
            this.baseAngleTransition = new VectorTransition([angle + 3/4*Math.PI], [angle - 3/4*Math.PI]);
        } else {
            this.baseAngleTransition = new VectorTransition([angle - 3/4*Math.PI], [angle + 3/4*Math.PI]);
        }
        // this.bladeAngleTransition = new VectorTransition([3/4*Math.PI], [-3/4*Math.PI]);
        this.bladeAngleTransition = this.baseAngleTransition;
        this.bladeWidthTransition = new VectorTransition([0], [12], 1, ovalTransition);
        
        this.hitbox.addInteraction(new DragActor(direction.normalized(1)));
        
        return this;
    }
    
    use() {
        super.use();
        
        if(this.phase >= 4 && this.phase <= 8) {
            let count = 6 - Math.abs(5 - this.phase);
            let positionM = this.hitbox.getPositionM();
            let avgsz = rectangle_averagesize(this.hitbox);
            
            for(let i = 0; i < count; ++i) {
                let angle = ((i+Math.random())/count) * 2*Math.PI;
                let direction = Vector.fromAngle(angle);
                
                let particle = PaintDroplet.fromMiddle(direction.normalized(avgsz/2).add(positionM), [12, 12]);
                particle.setSpeed(direction.normalized(irandom(2, 16)/8));
                
                addEntity(particle);
            }
        }
        
        return this;
    }
    
    updateTrailDrawableStyle(detProgress) {
        this.trailDrawable.trailStyle.step = 16 * (1-detProgress) / this.trailDrawable.trailStyle.duration;
        
        return this;
    }
}

AC["brushSlash"] = BrushSlash;
