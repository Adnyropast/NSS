
var jumps = [];

const AS_JUMP = set_gather("Jump", "AutoJump", "WallJump", "MidairJump", "EnergyJump");

function makeGroundedJumpEffect(position, avgsz, jumpDirection, speed) {
    // 
    
    let count = irandom(6, 9);
    
    entityExplode.xRadius = 0.375;
    entityExplode.initialAngle = Math.PI / count;
    entityExplode.radiusRotate = jumpDirection.getAngle();
    entityExplode(count, SmokeParticle, position, [avgsz/2, avgsz/2], 1)
    .forEach(function(entity) {
        entity.speed.multiply(random(1.25, 1.375));
    });
    
    // 
    
    entityExplode.initialAngle = jumpDirection.getAngle() + Math.PI/2;
    entityExplode(2, SpikeSmokeParticle, position, [avgsz, avgsz], 2)
    .forEach(function(entity) {
        removeDrawable(entity.drawable);
        // entity.resetSpikeDrawable(irandom(3, 5), new ColorTransition([-Math.PI/5], [+Math.PI/5]), 8, 16, 6);
        entity.resetSpikeDrawable(irandom(4, 6), new ColorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
        addDrawable(entity.drawable);
    });
}

function makeMidairJumpEffect(position, avgsz, jumpDirection, speed) {
    makeShockwave.lineWidth = 2;
    
    const shockwave = makeShockwave(Vector.addition(position, [0, avgsz/2]), avgsz/6);
    shockwave.drawable.setStyle(new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0], 24, powt(4)));
    shockwave.drawable.setStrokeStyle(new ColorTransition([223, 223, 223, 1], [191, 191, 191, 0], 24, powt(4)));
    shockwave.setSpeed(jumpDirection.times(-0.0625));
    shockwave.makeEllipse();
}

class Jump extends Action {
    constructor() {
        super();
        
        this.direction = new Vector(0, 0);
        this.initialForce = 3.75;
        this.initialForce = 1.75 + 0.125;
        this.reduct = 1.375;// 1.4375;
        
        this.normTransition;
        this.norm;
        
        this.startEffect = makeGroundedJumpEffect;
    }
    
    use() {
        if(this.phase == 0) {
            this.norm = this.direction.getNorm();
            
            for(let dim = 0, minDim = Math.min(this.direction.length, this.user.speed.getDimension()); dim < minDim; ++dim) {
                if(!isAlmostZero(this.direction[dim])) {
                    this.user.speed.set(dim, 0 + this.direction[dim]);
                }
            }
            
            const avgsz = rectangle_averageSize(this.user);
            const feetPositionM = [this.user.getXM(), this.user.getY2()];
            
            this.startEffect(feetPositionM, avgsz, this.direction, this.user.speed);
        }
        
        else {
            this.user.drag(this.direction.normalized(this.norm));
        }
        
        this.user.triggerEvent("jump", {action: this});
        
        this.norm /= this.reduct;
        if(isAlmostZero(this.norm)) {
            return this.end("norm zero");
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
        // console.log(this.endId);
        
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
    }
    
    use() {
        if(this.phase == 0) {
            const direction = this.user.getGravityDirection().normalized(-4);
            const minDim = Math.min(this.user.getDimension(), direction.length);
            
            for(let dim = 0; dim < minDim; ++dim) {
                if(!isAlmostZero(direction[dim])) {
                    this.user.speed[dim] = 0 + direction[dim];
                }
            }
            
            // this.user.setSpeed(1, -4);
            
            let avgsz = rectangle_averageSize(this.user);
            
            makeMidairJumpEffect(this.user.getPositionM(), avgsz, this.user.speed);
            
            this.user.triggerEvent("jump", {action: this});
        }
        
        if(this.phase > 30) {
            this.end();
        }
        
        return this;
    }
}

function makeEnergyJumpEffect(position, jumpDirection) {
    entityExplode.xRadius = 0.125;
    entityExplode.radiusRotate = jumpDirection.getAngle();
    entityExplode(8, GoldSmokeParticle, position, [8, 8], 1.5);
}

class EnergyJump extends Jump {
    constructor() {
        super();
        
        this.reduct = 1.375;
        
        this.norm;
    }
    
    use() {
        if(this.phase == 0) {
            let state = this.user.findState("energyJump-stale");
            
            if(typeof state !== "undefined") {
                this.setUseCost(state.countdown);
            }
            
            this.norm = this.user.stats["jump-force"];
            
            // this.norm /= stale + 1;
            this.direction = Vector.from(this.user.getGravityDirection()).normalize(-this.norm);
            
            if(this.user.spendEnergy(this.getUseCost())) {
                
            } else {
                return this.end("not enough energy");
            }
            
            makeEnergyJumpEffect([this.user.getXM(), this.user.getY2()], this.direction);
        }
        
        if(this.phase < 2) {
            // return this;
        }
        
        if(this.phase === 0) {
            for(let dim = 0, minDim = Math.min(this.direction.length, this.user.speed.getDimension()); dim < minDim; ++dim) {
                if(!isAlmostZero(this.direction[dim])) {
                    this.user.speed.set(dim, 0 + this.direction[dim]);
                }
            }
        }
        
        else {
            this.user.drag(this.direction.normalized(this.norm));
        }
        
        
        this.norm /= this.reduct;
        
        if(isAlmostZero(this.norm)) {
            return this.end();
        }
        
        // for(var i = 0; i < this.user.getDimension(); ++i) {
            // if(this.phase === 0) {
                // this.user.speed.set(i, this.direction[i]);
                // this.user.drag(i, this.direction[i]);
            // } else {
                // this.user.drag(i, this.direction[i]);
            // }
            // this.direction[i] /= (this.reduct);
            
            // if(isAlmostZero(this.direction[i])) {
                // this.direction[i] = 0;
            // }
        // }
        
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
                this.user.addStateObject({name: "energyJump-stale", countdown: 32});
            } else {
                state.countdown += 32;
            }
        }
        
        return super.onend();
    }
}

class AutoJump extends Action {
    constructor() {
        super();
        
        this.jumpAction = null;
    }
    
    use() {
        this.user.replaceStateObject({name : "noLadder", countdown : 2});
        
        if(this.jumpAction === null) {
            const user = this.user;
            const jumpForce = this.user.stats["jump-force"];
            
            const gravityDirection = this.user.getGravityDirection();
            
            if(!gravityDirection.isZero()) {
                let wallState = this.user.findState("wall");
                let midairJump = this.user.findState("midairJump");
                
                this.direction = Vector.from(gravityDirection).normalize(-jumpForce);
                
                const footstoolDetectionBox = (DetectionBox.fromMiddle(Vector.addition(this.user.getPositionM(), [0, this.user.getHeight()/2]), Vector.multiplication(this.user.size, 2)));
                
                if(this.user.hasState("water")) {
                    this.jumpAction = new Jump();
                    this.jumpAction.direction = this.direction;
                    this.jumpAction.startEffect = makeMidairJumpEffect;
                    
                    this.user.addImmediateAction(this.jumpAction);
                }
                
                else if(this.user.hasState("actuallyGrounded")) {
                    this.jumpAction = new Jump();
                    this.jumpAction.direction = this.direction;
                    
                    this.user.addImmediateAction(this.jumpAction);
                }
                
                else if(typeof wallState != "undefined") {
                    this.wallSide = wallState.side;
                    
                    this.direction.rotate(this.wallSide * this.user.stats["walljump-angle"]).normalize(this.user.stats["walljump-force"]);
                    
                    this.jumpAction = new WallJump();
                    
                    this.jumpAction.direction = this.direction;
                    this.user.addImmediateAction(this.jumpAction);
                }
                
                else if(footstoolDetectionBox.detectsDamageable(function(entity) {
                    return entity !== user && !entity.findState("footstooled");
                })) {
                    // addEntity(footstoolDetectionBox);
                    
                    const footstooled = footstoolDetectionBox.detected[0];
                    
                    this.user.setY2(footstooled.getY1());
                    
                    const direction = this.direction;
                    
                    footstoolDetectionBox.detected.forEach(function(entity) {
                        entity.hurt(0.125);
                        entity.stun(48);
                        entity.drag(direction.normalized(-1));
                        entityShake.intensity = 1/32;
                        entityShake(entity, 8);
                        
                        entity.addStateObject({
                            name: "footstooled",
                            countdown: 16
                        });
                    });
                    
                    this.jumpAction = new Jump();
                    this.jumpAction.direction = this.direction;
                    this.jumpAction.startEffect = function footstoolEffect(position, avgsz, jumpDirection, speed) {
                        makeGroundedJumpEffect(...arguments);
                        
                        entityExplode.yRadius = 0.5;
                        entityExplode(irandom(7, 9), StarParticle2, position, [avgsz/3, avgsz/3], 1.5)
                        .forEach(function(entity) {
                            entity.setLifespan(irandom(24, 32));
                            entity.sizeTransition.duration = entity.getLifespan();
                            entity.speed.multiply(random(0.9375, 1.0625));
                            // entity.setSelfBrake(1.0625);
                            entity.findInterrecipientWithId("drag").forceFactor = 0.25;
                            
                            entity.getDrawable().style.duration = entity.getLifespan();
                        });
                    };
                    
                    this.user.addImmediateAction(this.jumpAction);
                }
                
                else if(this.user.hasState("ladder")) {
                    this.jumpAction = new Jump();
                    this.jumpAction.direction = this.direction;
                    
                    this.user.addImmediateAction(this.jumpAction);
                }
                
                else if(midairJump !== undefined && midairJump.count > 0) {
                    --midairJump.count;
                    this.jumpAction = new Jump();
                    this.jumpAction.direction = this.direction;
                    this.jumpAction.startEffect = makeMidairJumpEffect;
                    
                    this.user.addImmediateAction(this.jumpAction);
                }
                
                else {
                    this.jumpAction = new EnergyJump();
                    
                    this.user.addImmediateAction(this.jumpAction);
                }
            }
            
            this.user.removeState("ladder");
        }
        
        if(this.jumpAction && this.jumpAction.hasEnded()) {
            this.jumpAction = null;
        }
        
        return this;
    }
    
    onend() {
        this.user.removeAction(this.jumpAction);
        
        return super.onend();
    }
}

busyBannedActions.add(AutoJump);

class WallJump extends Action {
    constructor() {
        super();
        
        this.direction = new Vector(0, 0);
        this.reduct = 1.375;
    }
    
    use() {
        if(this.phase === 0) {
            const wallState = this.user.findState("wall");
            this.user.removeState("wall");
            
            const avgsz = rectangle_averageSize(this.user);
            const positionM = Vector.from(this.user.getPositionM());
            positionM.add([-wallState.side * this.user.getWidth()/2, 0]);
            
            const angle = Math.PI/2 - wallState.side * 2 * Math.abs(-Math.PI/2 - this.direction.getAngle());
            const vector = Vector.fromAngle(angle);
            
            // 
            
            const spikeSmokeParticle = SpikeSmokeParticle.fromMiddle(positionM, [avgsz, avgsz]);
            spikeSmokeParticle.setSpeed(vector.normalized(2));
            addEntity(spikeSmokeParticle);
            
            // 
            
            const smokeCount = irandom(4, 6);
            
            angledSparks.initialDistance = avgsz/2;
            angledSparks(smokeCount, SmokeParticle, positionM, [avgsz/2, avgsz/2], new NumberTransition(angle - 0.375, angle + 0.375))
            .forEach(function(entity, index) {
                let speedNorm = 1.375 + backForthTiming(index/(smokeCount-1)) * 0.375;
                speedNorm = random(0.9375 * speedNorm, 1.0625 * speedNorm);
                
                entity.speed.multiply(speedNorm);
            });
            
            // 
            
            directionSparks.randomAngleVariation = Math.PI/3;
            directionSparks(3, PebbleParticle, positionM, [avgsz/6, avgsz/6], this.direction.rotated(wallState.side * Math.PI/4).divide(1.5))
            .forEach(function(entity) {
                
            });
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

busyBannedActions.add(WallJump);
