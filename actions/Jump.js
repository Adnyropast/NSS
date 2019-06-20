
var jumps = [];

class Jump extends Action {
    constructor() {
        super();
        this.id = ACT_JUMP;
        
        this.direction = null;
        this.initialForce = 3.75;
        this.initialForce = 1.75;
        this.reduct = 1.375;// 1.4375;
    }
    
    use() {
        if(this.phase == 0) {
            jumps.push(this);
            
            if(!this.user.hasState("grounded")) {
                return this.end("!grounded");
            }
            
            this.direction = Vector.from(this.user.gravityDirection).normalize(-this.initialForce);
        }
        
        this.user.addState("jumping");
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(Math.abs(this.direction[i]) < ALMOST_ZERO) {
                this.direction[i] = 0;
            }
        }
        
        for(var dim = 0; dim < this.direction.length; ++dim) {
            if(this.direction[dim] != 0) {
                if(this.phase < 3) {
                    var particle = SmokeParticle.fromMiddle(this.user.getXM(), this.user.getY2(), 16, 16).setSizeTransition([12, 12], [0, 0], 60);
                    particle.setSpeed(alterVector(this.user.speed, Math.PI/2 + this.phase).normalize());
                    addEntity(particle);
                    
                    var particle = SmokeParticle.fromMiddle(this.user.getXM(), this.user.getY2(), 16, 16).setSizeTransition([12, 12], [0, 0], 60);
                    particle.setSpeed(alterVector(this.user.speed, -Math.PI/2 - this.phase).normalize());
                    addEntity(particle);
                }
                
                return this;
            }
        }
        
        // this.end("direction zero");
        
        return this;
    }
    
    onend() {
        // console.log(this.endid);
        
        this.user.removeState("jumping");
        
        var index = jumps.indexOf(this);
        
        if(index != -1) {
            jumps.splice(index, 1);
        }
        
        return this;
    }
    
    allowsReplacement(action) {
        return action instanceof MidairJump;
    }
}

class MidairJump extends Jump {}

class EnergyJump extends Jump {
    use() {
        if(this.phase == 0) {
            this.initialForce /= this.user.getStale(this.id) + 1;
            this.direction = Vector.from(this.user.gravityDirection).normalize(-this.initialForce);
        }
        
        if(this.phase < 2) {
            return this;
        }
        
        // this.user.addAction(this.backSmoke);
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(Math.abs(this.direction[i]) < ALMOST_ZERO) {
                this.direction[i] = 0;
            }
        }
        
        for(var dim = 0; dim < this.direction.length; ++dim) {
            if(this.direction[dim] != 0) {
                this.user.addAction(this.backSmoke);
                
                return this;
            }
        }
        
        
        this.end();
        
        return this;
    }
    
    onend() {
        super.onend();
        this.user.makeStale(this.id, 16);
        
        return this;
    }
}
