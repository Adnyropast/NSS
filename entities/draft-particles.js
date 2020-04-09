
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
        
        this.setLifespan(irandom(32, 48));
        
        this.collidable = false;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(0.03125));
        // this.addInteraction(new BrakeRecipient(1.5));
        
        // this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/2), size, Vector.multiplication(size, 1/2), [0, 0]], this.lifespan));
        this.setSelfBrake(1.0546875);
        
        const avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(Math.min(Math.max(4, avgsz*2), 32), 12, 16)));
        this.drawable.setLifespan(this.lifespan);
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(avgsz/polygon_averageSize(this.drawable));
        this.drawable.initImaginarySize(avgsz);
        
        // this.drawable.setZIndex(random(-1, +1));
        
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
        this.setLifespan(12);
        
        const drawable = PolygonDrawable.from(roundparticle);
        
        drawable.setPositionM(this.getPositionM());
        drawable.multiplySize(rectangle_averageSize(this)/polygon_averageSize(drawable));
        drawable.initImaginarySize(rectangle_averageSize(this));
        
        this.setDrawable(drawable);
    }
    
    updateDrawable() {
        const drawable = this.getDrawable();
        
        drawable.setPositionM(this.getPositionM());
        drawable.setImaginarySize(rectangle_averageSize(this));
        
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

class PaintDroplet extends WaterDroplet {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(MultiColorTransition.from(CT_RAINBOW).setDuration(24).setStep(irandom(0, 23)));
    }
}

class OvalWaveParticle extends Entity {
    constructor() {
        super(...arguments);
        
        let avgsz = rectangle_averageSize(this);
        
        this.setDrawable(new PolygonDrawable(makePathPolygon(makeOvalPath(OvalWaveParticle.precision, 64, 64), OvalWaveParticle.lineWidth)));
        this.setLifespan(OvalWaveParticle.lifespan);
        this.drawable.setStyle(new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0], this.lifespan, powt(1/2)));
        this.drawable.rotate(Math.random() * 2*Math.PI);
        this.drawable.multiplySize(avgsz/64);
        this.drawable.initImaginarySize(avgsz);
        
        this.setSizeTransition(new VectorTransition(Array.from(this.size), Vector.multiplication(this.size, 4), this.lifespan, powt(1/2)));
        this.setSelfBrake(1.0625);
    }
    
    updateDrawable() {
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        if(Vector.normOf(this.direction) > 0) {
            this.drawable.stretchBase(this.direction);
            this.drawable.setImaginaryAngle(this.speed.getAngle());
        }
        
        return this;
    }
    
    makeEllipse(direction = [0, 12]) {
        this.direction = direction;
        this.controllers.add(function() {
            this.direction[1] /= 2;
        });
        
        return this;
    }
}

OvalWaveParticle.lineWidth = 1;
OvalWaveParticle.lifespan = 24;
OvalWaveParticle.precision = 32;

class SparkSpark extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(8);
        
        this.setSizeTransition(new VectorTransition(Vector.division(this.size, 2), Vector.from(this.size), this.lifespan, powt(1)));
        
        const avgsz = rectangle_averageSize(this);
        
        const drawable = PolygonDrawable.from(makeBurstPolygon2(
            new VectorTransition([2], [4], 16, Math.random),
            new VectorTransition([0], [20], 16, Math.random),
            4
        ));
        
        drawable.setPositionM(this.getPositionM());
        drawable.multiplySize(avgsz / polygon_averageSize(drawable));
        drawable.initImaginarySize(avgsz);
        drawable.setStyle(new ColorTransition([0, 255, 255, 1], [255, 0, 255, 0], this.lifespan, function(t) {return Math.pow(t, 5);}));
        
        this.setDrawable(drawable);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
}

class BluntCrownParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.drawable = PolygonDrawable.from(makeSpikePolygon(4, new VectorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(12, 24)}, function() {return irandom(32, 48)}, 16));
        
        // crownParticle.multiplySize(1/16);
        
        this.setLifespan(10);
        
        this.drawable.setZIndex(-Math.random()*16+15);
        
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(this.size, 1/2), Vector.from(this.size), Vector.multiplication(this.size, 1/2)], this.lifespan));
        
        this.setSelfBrake(1.125);
    }
    
    updateDrawable() {
        const drawable = this.getDrawable();
        
        drawable.stretchBase([0, 0.5]);
        drawable.setImaginarySize(rectangle_averageSize(this));
        drawable.setPositionM(this.getPositionM());
        
        drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
}

class BluntOvalParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(16);
        
        let avgsz = rectangle_averageSize(this);
        
        this.drawables[0] = PolygonDrawable.from(roundparticle);
        this.drawables[0]
        .multiplySize(avgsz/16)
        .stretchM([16, 0])
        .initImaginarySize(avgsz);
        
        this.setSelfBrake(1.0625);
    }
    
    updateDrawable() {
        let drawable = this.drawables[0];
        
        if(this.lifeCounter < 16) {
            drawable.shrinkBase([-1, 0]);
        }
        
        drawable.setImaginaryAngle(this.speed.getAngle());
        
        drawable.setPositionM(this.getPositionM());
        drawable.setImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
}

class PebbleParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(32);
        this.setSelfBrake(1.03125);
        this.accelerators.add([0, 0.03125]);
        
        const drawable = new PolygonDrawable(makeRandomPolygon(5, 12, 16));
        drawable.multiplySize(rectangle_averageSize(this)/polygon_averageSize(drawable));
        drawable.setStyle("gray");
        drawable.setStrokeStyle("dimGray");
        
        this.setDrawable(drawable);
    }
    
    updateDrawable() {
        const drawable = this.getDrawable();
        
        drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}

class StarParticle extends Entity {
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

class StarParticle2 extends Entity {
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
