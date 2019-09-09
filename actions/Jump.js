
var jumps = [];

class Jump extends Action {
    constructor() {
        super();
        this.id = ACT_JUMP;
        
        this.direction = null;
        this.initialForce = 3.75;
        this.initialForce = 1.75 + 0.125;
        this.reduct = 1.375;// 1.4375;
        
        this.grounded = false;
        this.wallState = undefined;
        this.wallSide = 0;
    }
    
    use() {
        if(this.phase == 0) {
            jumps.push(this);
            
            this.grounded = this.user.hasState("actuallyGrounded");
            this.wallState = this.user.findState("wall");
            let ladder = this.user.hasState("ladder");
            
            if(!this.grounded && typeof this.wallState == "undefined" && !ladder) {
                return this.end("No ground.");
            }
            
            this.user.removeState("ladder").removeState("ladder-maintain");
            
            let gravityDirection = this.user.findState("gravity");
            
            if(typeof gravityDirection == "undefined") {gravityDirection = [0, 0]}
            else {gravityDirection = gravityDirection.direction}
            
            this.direction = Vector.from(gravityDirection).normalize(-this.initialForce);
            
            if(this.grounded) {
                
            } else if(typeof this.wallState != "undefined") {
                this.wallSide = this.wallState.side;
                
                this.direction.rotate(this.wallSide / 4.5).multiply(1.375);
            }
        }
        
        this.user.addState("jumping");
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(isAlmostZero(this.direction[i])) {
                this.direction[i] = 0;
            }
        }
        
        for(var dim = 0; dim < this.direction.length; ++dim) {
            if(this.direction[dim] != 0) {
                if(this.phase == 0) {
                    if(this.grounded) {
                        for(let i = -0.5; i < 1; i += 0.25) {
                            let left = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getY2()]);
                            left.setSpeed((new Vector(-1, 0)).normalized(Math.random()).rotated(i));
                            addEntity(left);
                            let right = SmokeParticle.fromMiddle([this.user.getXM(), this.user.getY2()]);
                            right.setSpeed((new Vector(+1, 0)).normalized(Math.random()).rotated(-i));
                            addEntity(right);
                        }
                    } else {
                        for(let i = -0.5; i < 1; i += 0.25) {
                            let left = SmokeParticle.fromMiddle([this.user.getXM() - this.wallSide * this.user.getWidth()/2, this.user.getYM()]);
                            left.setSpeed((new Vector(0, -1)).normalized(Math.random()).rotated(this.wallSide*i));
                            addEntity(left);
                            let right = SmokeParticle.fromMiddle([this.user.getXM() - this.wallSide * this.user.getWidth()/2, this.user.getYM()]);
                            right.setSpeed((new Vector(0, +1)).normalized(Math.random()).rotated(-this.wallSide*i));
                            addEntity(right);
                        }
                    }
                    
                    /**
                    
                    var positionM = this.user.getPositionM();
                    
                    // for(var angle = Math.PI / 2; angle < 2 * Math.PI + Math.PI / 2; angle += Math.PI / 3) {
                    for(let angle = -Math.PI/8; angle < 2*Math.PI - Math.PI/8; angle += Math.PI/4) {
                        var cos = Math.cos(angle), sin = Math.sin(angle);
                        var particle = SmokeParticle.fromMiddle(positionM);
                        particle.setSpeed([2*cos, 2*sin]);
                        addEntity(particle);
                    }
                    
                    var particle = SmokeParticle.fromMiddle(positionM, [16, 16]);
                    addEntity(particle);
                    
                    /**/
                }
                
                return this;
            }
        }
        
        this.end("direction zero");
        
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
            let state = this.user.findState("energyJump-stale");
            let stale = 0;
            
            if(typeof state != "undefined") {
                stale = state.countdown;
            }
            
            this.initialForce /= stale + 1;
            this.direction = Vector.from(this.user.gravityDirection).normalize(-this.initialForce);
        }
        
        if(this.phase < 2) {
            return this;
        }
        
        // this.user.addAction(this.backSmoke);
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(isAlmostZero(this.direction[i])) {
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
        let state = this.user.findState("energyJump-stale");
        let stale = 0;
        
        if(typeof state != "undefined") {
            stale = state.countdown;
        }
        
        this.user.addStateObject("energyJump-stale", stale + 16);
        
        return super.onend();
    }
}
