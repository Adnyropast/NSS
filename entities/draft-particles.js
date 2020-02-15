
class Particle extends Decoration {
    constructor(position, size) {
        super(position, size);
        this.setZIndex(-1);
        this.setLifespan(1);
        
        this.setSizeTransition(new ColorTransition(this.size, this.size));
    }
}

class TpParticle extends Particle {
    constructor(position, size) {
        super(position, size);
    }
}

class GoldSmokeParticle extends Particle {
    constructor(position, size) {
        super(position, size);
        
        this.setSelfBrake(1.0625);
        this.setLifespan(32);
        // this.setColorTransition([0, 255, 255, 127], [0, 255, 255, 0], 60);
        // this.setDrawable(PolygonDrawable.from(flameparticle).multiplySize(1/4));
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(24, 12, 16)).setLifespan(32).setPositionM(this.getPositionM()).multiplySize(8/16));
        
        this.drawable.multiplySize(rectangle_averageSize(this)/16);
        
        if(!Math.floor(Math.random() * 2)) {
            this.drawable.setStyle(new ColorTransition([0, 255, 255, 127], [0, 255, 255, 0], 60));
        } else {
            this.drawable.setStyle(new ColorTransition([0, irandom(191, 255), 255, 1], [0, 63, 255, 0], 32, function(t) {return Math.pow(t, 4);}));
        }
        
        this.drawable.setZIndex(random(-1, 8));
        
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/1.125), Vector.from(size), [0, 0]], 32));
        this.drawable.initImaginarySize(rectangle_averageSize(this));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        // this.drawable.multiplySize(1/1.03125);
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        // this.drawable.shadowBlur = this.lifespan - this.lifeCounter;
        
        return this;
    }
}

const smokeColorTransition = new ColorTransition([255, 255, 255, 255 / 255], [223, 223, 223, 191 / 255], 32, powt(2));

class SmokeParticle extends Particle {
    constructor(position, size = [8, 8]) {
        super(position, size);
        
        this.setLifespan(48);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(0.03125));
        // this.addInteraction(new BrakeRecipient(1.5));
        
        // this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/2), size, Vector.multiplication(size, 1/2), [0, 0]], this.lifespan));
        this.setSelfBrake(1.03125);
        
        const avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(Math.min(Math.max(4, avgsz*2), 32), 12, 16)));
        this.drawable.setLifespan(this.lifespan);
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(avgsz/polygon_averageSize(this.drawable));
        this.drawable.initImaginarySize(avgsz);
        
        this.drawable.setZIndex(random(-1, +1));
        
        this.drawable.setStyle(ColorTransition.from(smokeColorTransition));
        this.drawable.setStrokeStyle("lightGray");
    }
    
    updateDrawable() {
        // this.drawable.multiplySize(1/1.0625);
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.rotate(Math.PI/128);
        
        return this;
    }
}

class FireSmokeParticle extends Particle {
    constructor(position, size) {
        super(position, size);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        this.setLifespan(32);
        // this.setColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 60);
        
        const CT_FIRESMOKE = new ColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 32);
        
        // this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/2), Vector.from(size), [0, 0]], 32));
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(-Math.pow(2, -10)));
        
        const avgsz = rectangle_averageSize(this);
        
        for(let i = 0; i < 3; ++i) {
            let drawable = new PolygonDrawable(makeRandomPolygon(16, 12, 16));
            drawable.setStyle(CT_FIRESMOKE.copy().setStep(random(0, 8)));
            drawable.multiplySize(random(1/2, 1));
            drawable.multiplySize(avgsz/polygon_averageSize(drawable));
            drawable.initImaginarySize(avgsz);
            drawable.setZIndex(random(-1, 1));
            
            this.drawables.push(drawable);
        }
        
        this.setSelfBrake(1.03125);
        this.addInteraction(new DragRecipient(-0.125));
    }
    
    updateDrawable() {
        const avgsz = rectangle_averageSize(this);
        const positionM = this.getPositionM();
        
        for(let i = 0; i < this.drawables.length; ++i) {
            let drawable = this.drawables[i];
            
            drawable.setImaginarySize(avgsz);
            drawable.setPositionM(positionM);
        }
        
        return super.updateDrawable();
    }
}

class FireParticle extends Particle {
    constructor(position, size) {
        super(...arguments);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        this.setLifespan(irandom(24, 64));
        // this.setColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 60);
        // this.setStyle(new ColorTransition([255, 255, 0, 127], [255, 0, 0, 127], this.lifespan));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, random(1/4, 1/2)), Vector.from(size), Vector.multiplication(size, random(1/4, 1/2)), [0, 0]], this.lifespan, powt(1/1.25)));
        
        this.addInteraction(new ReplaceRecipient());
        // this.addInteraction(new DragRecipient(-Math.pow(2, -2)));
        this.accelerators.add([0, -0.0625]);
        
        this.setSelfBrake(1.125);
        
        for(let i = 0; i < 3; ++i) {
            const drawable = makeFireParticle();
            drawable.setLifespan(-1);
            
            drawable.setZIndex(random(-1, 0.25));
            
            drawable.multiplySize(rectangle_averageSize(this) / polygon_averageSize(drawable));
            
            drawable.initImaginarySize(rectangle_averageSize(this));
            
            drawable.setStyle(new ColorTransition([255, 255, 127, 1], [255, 0, 0, 0.375], this.lifespan, powt(1/2)));
            
            this.drawables.push(drawable);
        }
    }
    
    updateDrawable() {
        const positionM = this.getPositionM();
        
        for(let i = 0; i < this.drawables.length; ++i) {
            const drawable = this.drawables[i];
            
            drawable.setPositionM(positionM);
            drawable.setImaginarySize(rectangle_averageSize(this));
        }
        
        return this;
    }
}

class DiamondParticle extends Entity {
    constructor() {
        super(...arguments);
        
        const avgsz = rectangle_averageSize(this);
        
        this.setLifespan(24);
        this.setDrawable(PolygonDrawable.from(makePathPolygon([[0, -avgsz/2], [0, 0], [0, +avgsz/2]], avgsz/16)));
        this.drawable.setStyle(new ColorTransition(CV_WHITE, CV_YELLOW, this.lifespan, powt(1/2)));
        this.drawable.rotate(Math.PI/2).setPositionM(this.getPositionM());
        
        this.setSelfBrake(1.0625);
        
        // this.drawable.setShadowBlur(8);
    }
    
    updateDrawable() {
        const avgsz = rectangle_averageSize(this);
        
        this.drawable.setPositionM(this.getPositionM());
        // this.drawable.multiplySize(1/1.125);
        this.drawable.shrinkBase([0, avgsz/(16*(this.lifespan+1))]);
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
}

class OvalParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setDrawable(PolygonDrawable.from(roundparticle));
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.initImaginarySize(rectangle_averageSize(this));
        this.setLifespan(12);
        
        this.controllers.add(function() {
            if(this.sizeTransition) {
                this.setSizeM(this.sizeTransition.getNext());
            }
        });
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
    
    setSizeTransition() {
        if(arguments[0] instanceof VectorTransition) {
            this.sizeTransition = arguments[0];
        } else {
            this.sizeTransition = new VectorTransition(...arguments);
        }
        
        return this;
    }
}

const smokeColorTransition2 = new ColorTransition([255, 255, 255, 255 / 255], [223, 223, 223, 0 / 255], 16, function(t) {return Math.pow(t, 5)});

class SpikeSmokeParticle extends Particle {
    constructor(position, size) {
        super(...arguments);
        
        this.setLifespan(16);
        this.setSizeTransition(new ColorTransition(Vector.multiplication(size, 1/2), Vector.multiplication(size, 1.25), this.lifespan));
        this.setSelfBrake(1.03125);
        
        let spikesCount = irandom(4, 6);
        let angleDiff = Math.PI/4;
        
        // this.resetSpikeDrawable(spikesCount, new ColorTransition([-angleDiff], [+angleDiff]), irandom(8, 10), irandom(16, 18), 6);
        this.resetSpikeDrawable(spikesCount, new ColorTransition([-angleDiff], [+angleDiff]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
    }
    
    updateDrawable() {
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
    
    resetSpikeDrawable() {
        this.drawable = new SpikeDrawable(...arguments);
        
        this.drawable.setStyle(ColorTransition.from(smokeColorTransition2));
        
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.initImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
}

class WaterDroplet extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(24);
        
        this.setSelfBrake(1.03125);
        
        this.addInteraction(new DragRecipient(0.03125));
        
        this.setSizeTransition(new VectorTransition(this.size, [0, 0], this.lifespan, powt(8)));
        
        let avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(roundparticle));
        
        this.drawable.multiplySize(avgsz/12/irandom(4, 16));
        this.drawable.stretchM([16, 0]);
        
        this.drawable.initImaginarySize(avgsz);
    }
    
    updateDrawable() {
        if(this.lifeCounter < 14) {this.drawable.shrinkBase([-1, 0]);}
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}
