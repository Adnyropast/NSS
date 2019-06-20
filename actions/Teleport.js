
class TransitionVector extends Vector {
    
}

var i = -1;

class TpParticle extends Decoration {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setZIndex(-1);
        this.setLifespan(1);
        
        this.i = ++i;
        this.initialColor;
        this.currentColor;
        this.endColor;
        this.duration;
        this.setColorTransition([0, 0, 0, 0], [255, 255, 255, 255], 10);
        
        this.step = 0;
        
        this.initialSize;
        this.endSize;
        this.sizeDuration;
        this.sizeStep;
        this.setSizeTransition(this.getSize(), this.getSize(), 1);
    }
    
    setColorTransition(initialColor, endColor, duration) {
        this.initialColor = initialColor;
        this.currentColor = Vector.from(this.initialColor);
        this.endColor = endColor;
        this.duration = duration;
        this.step = 0;
        
        return this;
    }
    
    setSizeTransition(initialSize, endSize, duration) {
        this.initialSize = initialSize;
        this.setSize(initialSize);
        this.endSize = endSize;
        this.sizeDuration = duration;
        this.sizeStep = 0;
        
        return this;
    }
    
    convert(alpha) {
        return ((alpha < 16) ? "0" : "") + Math.floor(alpha).toString(16);
    }
    
    getHex(rgba) {
        return "#" + this.convert(rgba[0]) + this.convert(rgba[1]) + this.convert(rgba[2]) + this.convert(rgba[3]);
    }
    
    getRGBA(rgba) {
        return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + (rgba[3] / 255) + ")";
    }
    
    t() {console.log("%c" + this.i + " - " + this.currentColor + " - " + this.style, "color : " + this.style);}
    
    update() {
        super.update();
        
        var stepVector = Vector.from(this.endColor).subtract(this.initialColor).divide(this.duration);
        
        this.currentColor = this.currentColor.add(stepVector);
        
        this.style = this.getRGBA(this.currentColor);
        
        // 
        
        var positionM = this.getPositionM();
        
        this.setSize(Vector.from(this.endSize).subtract(this.initialSize).divide(this.sizeDuration).add(this.getSize()));
        
        this.setPositionM(positionM);
        
        return this;
    }
}

class Teleportation extends Action {
    constructor(targetPosition, t1, t2) {
        super();
        this.id = 1;
        this.setUseCost(10);
        
        this.targetPosition = targetPosition;
        this.t1;
        if(typeof t1 == "undefined") {
            this.t1 = 10;
        } else {
            this.t1 = t1;
        }
        this.t2;
        if(typeof t2 == "undefined") {
            this.t2 = 20;
        } else {
            this.t2 = t2;
        }
    }
    
    setTime1(t1) {
        this.t1 = t1;
        
        return this;
    }
    
    setTime2(t2) {
        this.t2 = t2;
        
        return this;
    }
    
    use() {
        if(this.phase == 0) {
            var particle = new TpParticle(this.user.getX(), this.user.getY(), 64, 64);
            particle.setPositionM(this.user.getPositionM());
            particle.setSizeTransition([64, 64], [0, 0], 30);
            particle.setColorTransition([0, 255, 255, 0], [0, 255, 255, 255], 30);
            particle.setLifespan(30);
            addEntity(particle);
        }
        
        if(this.phase == this.t1) {
            var particle = new TpParticle(this.targetPosition[0], this.targetPosition[1], 64, 64);
            particle.setColorTransition([0, 255, 255, 255], [0, 255, 255, 0], 30);
            particle.setSizeTransition([0, 0], [64, 64], 30);
            particle.setPositionM(this.targetPosition);
            particle.setLifespan(30);
            addEntity(particle);
            
            this.user.setPositionM(this.targetPosition);
            this.user.brake(Infinity);
        }
        
        if(this.phase >= this.t2) {
            this.end();
        }
        
        return this;
    }
}
