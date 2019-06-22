
class TransitionVector extends Vector {
    
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
            var particle = new TpParticle([this.user.getX(), this.user.getY()], [64, 64]);
            particle.setPositionM(this.user.getPositionM());
            particle.setSizeTransition([64, 64], [0, 0], 30);
            particle.setColorTransition([0, 255, 255, 0], [0, 255, 255, 255], 30);
            particle.setLifespan(30);
            addEntity(particle);
        }
        
        if(this.phase == this.t1) {
            var particle = new TpParticle([this.targetPosition[0], this.targetPosition[1]], [64, 64]);
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
