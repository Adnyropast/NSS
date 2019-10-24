
const AS_ARTIST = set_gather("brushSlash", "paintBomb", "paintSpray");

class PaintDroplet extends Entity {
    constructor() {
        super(...arguments);
        
        let avgsz = rectangle_averageSize(this);
        
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
        this.drawable.setImaginarySize(rectangle_averageSize(this));
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
            let avgsz = rectangle_averageSize(this.hitbox);
            
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

class PaintBombEntity extends Hitbox {
    constructor() {
        super(...arguments);
        
        let avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(makeRegularPolygon(16, avgsz/2)));
        this.drawable.setStyle(MultiColorTransition.from(CT_RAINBOW).setDuration(32));
        this.drawable.initImaginarySize(avgsz);
        
        this.addInteraction(new DragRecipient(0.5));
        this.addInteraction(new ContactVanishRecipient(CVF_OBSTACLE));
        this.addInteraction(new TypeDamager());
        this.setTypeOffense("paint", 4);
        this.addInteraction(new BrakeRecipient(0.5));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
    
    onremove() {
        typeImpacts["paint"](this, this);
        
        return super.onremove();
    }
    
    update() {
        super.update();
        
        if(this.speed.isZero()) {
            removeEntity(this);
        }
        
        return this;
    }
}

class PaintBomb extends BusyAction {
    constructor() {
        super();
        this.setId("paintBomb");
    }
    
    use() {
        if(this.phase == 3) {
            let direction = this.user.getCursorDirection();
            
            let bomb = PaintBombEntity.fromMiddle(Vector.addition(this.user.getPositionM(), direction.normalized(rectangle_averageSize(this.user)/2)), [8, 8]);
            bomb.setSpeed(direction.normalized(4));
            bomb.shareBlacklist(this.user.getBlacklist());
            
            addEntity(bomb);
        } if(this.phase == 16) {
            this.end();
        }
        
        return this;
    }
}

AC["paintBomb"] = PaintBomb;

class PaintCloud extends Hitbox {
    constructor(position, size) {
        super(...arguments);
        
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(32, 14, 16)));
        let ct = MultiColorTransition.from(CT_RAINBOW).setDuration(64);
        for(let i = 0; i < ct.vectors.length; ++i) {
            ct.vectors[i] = Array.from(ct.vectors[i]);
            ct.vectors[i][3] = 0.375;
        }
        this.drawable.setStyle(ct);
        this.setLifespan(256);
        
        this.drawable.initImaginarySize(rectangle_averageSize(this));
        
        let sizeTransition = new MultiColorTransition([[1, 1], size, size, size, size, [0, 0]], this.lifespan);
        
        this.controllers.add(function() {
            this.setSizeM(sizeTransition.getNext());
        });
        
        this.addInteraction(new BrakeRecipient(1));
        this.addInteraction((new TypeDamager()).setRehit(32));
        this.setTypeOffense("paint", 0.125);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
}

class PaintSpray extends BusyAction {
    constructor() {
        super();
        this.setId("paintSpray");
    }
    
    use() {
        this.phase %= this.phaseLimit;
        
        if(this.phase % 8 == 0) {
            let direction = this.user.getCursorDirection();
            
            let cloud = PaintCloud.fromMiddle(Vector.addition(this.user.getPositionM(), direction.normalized(rectangle_averageSize(this.user)/2)), [16, 16]);
            cloud.setSpeed(direction.normalized(1));
            cloud.shareBlacklist(this.user.getBlacklist());
            
            addEntity(cloud);
        }
        
        return this;
    }
}

AC["paintSpray"] = PaintSpray;
