
class TransitionVector extends Vector {
    
}

class Teleportation extends Action {
    constructor(t1 = 10, t2 = 20) {
        super();
        this.id = "teleportation";
        this.setUseCost(10);
        
        this.t1 = t1;
        this.t2 = t2;
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
            particle.setSizeTransition(new ColorTransition([64, 64], [0, 0], 30));
            particle.setStyle(new ColorTransition([0, 255, 255, 0], [0, 255, 255, 1], 30));
            particle.setZIndex(this.user.getZIndex() - 1);
            particle.setLifespan(30);
            addEntity(particle);
        }
        
        if(this.phase == this.t1) {
            var targetPosition = this.user.getCursor().getPositionM();
            
            var particle = TpParticle.fromMiddle(targetPosition, [64, 64]);
            particle.setStyle(new ColorTransition([0, 255, 255, 1], [0, 255, 255, 0], 30));
            particle.setSizeTransition(new ColorTransition([0, 0], [64, 64], 30));
            particle.setLifespan(30);
            particle.setZIndex(this.user.getZIndex() - 1);
            addEntity(particle);
            
            this.user.setPositionM(targetPosition);
            this.user.brake(Infinity);
        }
        
        if(this.phase >= this.t2) {
            this.end();
        }
        
        return this;
    }
}
