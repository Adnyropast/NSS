
class Jump extends Action {
    constructor() {
        super();
        this.id = 0;
        
        this.direction = null;
        this.initialForce = 3.75;
        this.reduct = 1.375;// 1.4375;
        
        this.backSmoke = new BackSmoke();
    }
    
    use() {
        if(this.phase == 0) {
            this.direction = Vector.from(this.user.gravityDirection).normalize(-this.initialForce);
        }
        
        if(this.phase < 2) {
            return this;
        }
        
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
        
        
        this.backSmoke.shouldEnd = true;
        this.end();
        
        return this;
    }
    
    onend() {
        this.user.removeAction(this.backSmoke);
        
        return this;
    }
    
    allowsReplacement(action) {
        return action instanceof MidairJump;
    }
}

class MidairJump extends Jump {}
