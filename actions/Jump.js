
var jumps = [];

const AS_JUMP = set_gather(ACT_JUMP, "autoJump", "wallJump", "midairJump", "energyJump");

class Jump extends Action {
    constructor() {
        super();
        this.id = ACT_JUMP;
        
        this.direction = new Vector(0, 0);
        this.initialForce = 3.75;
        this.initialForce = 1.75 + 0.125;
        this.reduct = 1.375;// 1.4375;
        
        this.normTransition;
    }
    
    use() {
        /**/
        if(this.phase == 0) {
            const averagesize = rectangle_averageSize(this.user);
            const positionM = this.user.getPositionM();
            const feetPositionM = Vector.addition(positionM, this.direction.normalized(-averagesize/2));
            
            // 
            
            let count = irandom(6, 9);
            
            entityExplode.xRadius = 0.375;
            entityExplode.initialAngle = Math.PI / count;
            entityExplode.radiusRotate = this.direction.getAngle();
            entityExplode(count, SmokeParticle, feetPositionM, [8, 8], 1)
            .forEach(function(entity) {
                // entity.speed.normalize(Math.random());
                entity.speed.multiply(random(1.0, 1.5));
                // entity.removeInterrecipientWithId("replace");
            });
            entityExplode.xRadius = 1;
            entityExplode.initialAngle = 0;
            entityExplode.radiusRotate = 0;
            
            // 
            
            entityExplode.initialAngle = this.direction.getAngle() + Math.PI/2;
            entityExplode(2, SpikeSmokeParticle, feetPositionM, [averagesize, averagesize], 2)
            .forEach(function(entity) {
                removeDrawable(entity.drawable);
                // entity.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), 8, 16, 6);
                entity.resetSpikeDrawable(irandom(4, 6), new ColorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
                addDrawable(entity.drawable);
            });
            entityExplode.initialAngle = 0;
        }
        /**/
        
        this.user.triggerEvent("jump", {action: this});
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(isAlmostZero(this.direction[i])) {
                this.direction[i] = 0;
            }
        }
        
        if(this.phase > 0 && this.user.hasState("grounded")) {
            return this.end("grounded");
        }
        
        if(this.direction.isZero()) {
            return this.end("direction zero");
        }
        
        for(var dim = 0; dim < this.direction.length; ++dim) {
            if(this.direction[dim] != 0) {
                
                return this;
            }
        }
        
        return this;
    }
    
    onend() {
        // console.log(this.endid);
        
        return this;
    }
    
    allowsReplacement(action) {
        return action instanceof MidairJump;
    }
}

busyBannedActions.add(Jump);

class MidairJump extends Jump {
    constructor() {
        super();
        this.setId("midairJump");
    }
    
    use() {
        if(this.phase == 0) {
            this.user.setSpeed(1, -4);
            
            let avgsz = rectangle_averageSize(this.user);
            
            makeShockwave.lineWidth = 2;
            
            const shockwave = makeShockwave(Vector.addition(this.user.getPositionM(), [0, avgsz/2]), avgsz/6);
            shockwave.drawable.setStyle(new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0], 24, powt(4)));
            shockwave.drawable.setStrokeStyle(new ColorTransition([223, 223, 223, 1], [191, 191, 191, 0], 24, powt(4)));
            shockwave.setSpeed(this.user.speed.times(-0.0625));
            shockwave.makeEllipse();
            
            
            makeShockwave.lineWidth = 1;
            
            this.user.triggerEvent("jump", {action: this});
        }
        
        if(this.phase > 30) {
            this.end();
        }
        
        return this;
    }
}

class EnergyJump extends Jump {
    constructor() {
        super();
        this.setId("energyJump");
        
        this.reduct = 1.375;
    }
    
    use() {
        if(this.phase == 0) {
            let state = this.user.findState("energyJump-stale");
            let stale = 0;
            
            if(typeof state != "undefined") {
                stale = state.countdown;
            }
            
            let force = this.user.stats["jump-force"];
            
            // force /= stale + 1;
            this.direction = Vector.from(this.user.getGravityDirection()).normalize(-force);
            
            if(stale < this.user.getEnergy()) {
                this.user.hurt(stale);
            } else {
                return this.end("not enough energy");
            }
            
            entityExplode.xRadius = 0.125;
            entityExplode.radiusRotate = this.direction.getAngle();
            entityExplode(8, GoldSmokeParticle, [this.user.getXM(), this.user.getY2()], [8, 8], 1.5);
            entityExplode.xRadius = 1;
            entityExplode.radiusRotate = 0;
        }
        
        if(this.phase < 2) {
            // return this;
        }
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            if(this.phase === 0) {
                // this.user.speed.set(i, this.direction[i]);
                this.user.drag(i, this.direction[i]);
            } else {
                this.user.drag(i, this.direction[i]);
            }
            this.direction[i] /= (this.reduct);
            
            if(isAlmostZero(this.direction[i])) {
                this.direction[i] = 0;
            }
        }
        
        for(var dim = 0; dim < this.direction.length; ++dim) {
            if(this.direction[dim] != 0) {
                
                
                return this;
            }
        }
        
        
        this.end();
        
        return this;
    }
    
    onend() {
        if(this.phase > 0) {
            let state = this.user.findState("energyJump-stale");
            
            if(typeof state === "undefined") {
                this.user.addStateObject({name: "energyJump-stale", countdown: 16});
            } else {
                state.countdown += 16;
            }
        }
        
        return super.onend();
    }
}

AC["energyJump"] = EnergyJump;

class AutoJump extends Action {
    constructor() {
        super();
        this.setId("autoJump");
        
        this.jumpAction = null;
    }
    
    use() {
        if(this.jumpAction === null) {
            let grounded = this.user.hasState("actuallyGrounded");
            let wallState = this.user.findState("wall");
            let ladder = this.user.hasState("ladder");
            
            let midairJump = this.user.findState("midairJump");
            
            if(!grounded && typeof wallState == "undefined" && !ladder && !midairJump) {
                return this;
            }
            
            if(ladder) {
                this.user.removeState("ladder");
                this.user.replaceStateObject({name : "noLadder", countdown : 20});
            }
            
            let gravityDirection = this.user.getGravityDirection();
            
            let jumpForce = this.user.stats["jump-force"];
            
            this.direction = Vector.from(gravityDirection).normalize(-jumpForce);
            
            if(grounded) {
                if(!gravityDirection.isZero()) {
                    this.jumpAction = new Jump();
                    this.jumpAction.direction = this.direction;
                    
                    this.user.addAction(this.jumpAction);
                }
            } else if(typeof wallState != "undefined") {
                this.wallSide = wallState.side;
                
                this.direction.rotate(this.wallSide * this.user.stats["walljump-angle"]).normalize(this.user.stats["walljump-force"]);
                
                this.jumpAction = new WallJump();
                
                this.jumpAction.direction = this.direction;
                this.user.addAction(this.jumpAction);
            } else if(ladder) {
                this.jumpAction = new Jump();
                this.jumpAction.direction = this.direction;
                
                this.user.addAction(this.jumpAction);
            } else if(midairJump.count > 0) {
                --midairJump.count;
                this.jumpAction = new MidairJump();
                
                this.user.addAction(this.jumpAction);
            }
        }
        
        if(this.jumpAction && this.jumpAction.endid != -1) {
            this.jumpAction = null;
        }
        
        return this;
    }
    
    onend() {
        this.user.removeAction(this.jumpAction);
        
        return super.onend();
    }
}

AC["autoJump"] = AutoJump;

class WallJump extends Action {
    constructor() {
        super();
        this.setId("wallJump");
        
        this.direction = new Vector(0, 0);
        this.reduct = 1.375;
    }
    
    use() {
        if(this.phase === 0) {
            const wallState = this.user.findState("wall");
            this.user.removeState("wall");
            
            const avgsz = rectangle_averageSize(this.user);
            const positionM = Vector.addition(this.user.getPositionM(), this.direction.normalized(-avgsz/2));
            
            // 
            
            angledSparks.initialAngle = this.direction.getAngle() + Math.PI;
            angledSparks(2, SpikeSmokeParticle, positionM, [avgsz, avgsz], new NumberTransition(-Math.PI/4, +Math.PI/4))
            .forEach(function(entity) {
                entity.speed.multiply(2);
                removeDrawable(entity.drawable);
                // entity.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), 8, 16, 6);
                entity.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
                addDrawable(entity.drawable);
            });
            angledSparks.initialAngle = 0;
            
            // 
            
            directionSparks.initialDistance = avgsz/2;
            directionSparks.randomAngleVariation = 0.5;
            directionSparks(irandom(2, 3), SmokeParticle, positionM, undefined, this.direction.rotated(-3*Math.PI/4).normalize())
            .forEach(function(entity) {
                entity.speed.multiply(random(0.75, 1.75));
            });
            directionSparks(irandom(2, 3), SmokeParticle, positionM, undefined, this.direction.rotated(+3*Math.PI/4).normalize())
            .forEach(function(entity) {
                entity.speed.multiply(random(0.75, 1.75));
            });
            directionSparks.initialDistance = 0;
            directionSparks.randomAngleVariation = 0;
        }
        
        this.user.triggerEvent("jump", {action: this});
        
        for(var i = 0; i < this.user.getDimension(); ++i) {
            this.user.drag(i, this.direction[i]);
            this.direction[i] /= (this.reduct);
            
            if(isAlmostZero(this.direction[i])) {
                this.direction[i] = 0;
            }
        }
        
        if(this.direction.isZero()) {
            return this.end("direction zero");
        }
        
        return this;
    }
}
