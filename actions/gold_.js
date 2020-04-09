
const AS_GOLD = set_gather("GoldFlurry", "RocketPunch", "MultiaimShots", "GoldenJab");

class GoldAbility extends BusyAction {
    constructor() {
        super();
    }
}

class GoldSolid extends Hitbox {
    constructor(position, size) {
        super(position, size);
        
        this.setDrawable(PolygonDrawable.from(flameparticle).multiplySize(1/4));
        this.drawable.multiplySize(rectangle_averageSize(this)/12);
        this.drawable.stretchM([12, 0]);
        this.drawable.setPositionM(this.getPositionM());
        this.setStyle(new ColorTransition([255, 255, 0, 1], [0, 255, 255, 0.75], 16));
        this.setTypeOffense(FX_GOLD_, 0.25);
        this.setLifespan(16);
        this.setSelfBrake(1.1875);
    }
    
    updateDrawable() {
        this.drawable.shrinkBase([-0.5, 0]);
        
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(1/1.025);
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
}

class GoldFlurry extends GoldAbility {
    constructor() {
        super();
        
        this.setUseCost(1);
    }
    
    use() {
        this.phase %= this.phaseLimit;
        this.t = this.phase % (2 * Math.PI) * 16;
        
        if(this.phase % 6 == 0) {
            if(this.user.spendEnergy(this.getUseCost())) {
                let direction = this.user.getCursorDirection();
                direction.rotate(Math.sin(this.t) * 0.5);
                
                let size = irandom(7, 9);
                
                var hitbox = GoldSolid.fromMiddle(direction.normalized(rectangle_averageSize(this.user)/4).add(this.user.getPositionM()), [size, size]);
                hitbox.shareBlacklist(this.user.getBlacklist());
                
                hitbox.setSpeed(direction.normalized(2.5));
                hitbox.launchDirection = hitbox.speed.normalized(0.5);
                
                addEntity(hitbox);
            } else {
                return this.end();
            }
        }
        
        return this;
    }
    
    onadd() {
        this.user.addAction(new Still());
        
        return super.onadd();
    }
    
    onend() {
        this.user.removeActionsWithConstructor(Still);
        
        return this;
    }
}

class RocketPunchProjectile extends Projectile {
    constructor(position, size) {
        super(position, size);
        
        this.setLifespan(12);
        
        this.setDrawable(PolygonDrawable.from(flameparticle).multiplySize(1/2));
        this.drawable.setPositionM(this.getPositionM());
        this.setStyle(new ColorTransition([255, 255, 255, 1], [0, 255, 255, 0.5], this.lifespan));
        // this.setBrakeExponent(0);
        // this.setForceFactor(0);
        this.setTypeOffense(FX_GOLD_, 4);
        
        this.setZIndex(-97);
        
        let sizeTransition = new ColorTransition(Vector.multiplication(size, 1/2), size, this.lifespan, backForthTiming);
        
        this.controllers.add(function() {
            this.setSizeM(sizeTransition.getNext());
        });
        
        this.drawable.initImaginarySize(rectangle_averageSize(this));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
    
    update() {
        super.update();
        
        if(this.lifeCounter % 1 == 0) {
            let particle = GoldSmokeParticle.fromMiddle(this.getPositionM(), this.size);
            
            let angle = irandom(0, 360)*Math.PI/180;
            
            particle.setSpeed(Vector.fromAngle(angle).normalize(Math.random() * 2 - 1));
            
            addEntity(particle);
        }
        
        return this;
    }
    
    oncontactvanish() {
        typeImpacts[FX_GOLD_](this, this);
        
        return this;
    }
}

class RocketPunch extends GoldAbility {
    constructor() {
        super();
        
        this.setUseCost(2);
    }
    
    use() {
        if(this.phase == 0) {
            if(this.user.spendEnergy(this.getUseCost())) {
                this.setRemovable(false);
                
                
                
                let particle = PolygonDrawable.from(makeRandomPolygon(16, 16, 16));
                particle.setLifespan(16);
                particle.setStyle(new ColorTransition([255, 255, 255, 0], [0, 255, 255, 0.75], particle.lifespan));
                
                particle.setPositionM(this.user.getPositionM());
                
                let sizeTransition = new VectorTransition([16], [0], particle.lifespan);
                particle.initImaginarySize(sizeTransition.at(0)[0]);
                
                let user = this.user;
                
                particle.controllers.add(function() {
                    this.setImaginarySize(sizeTransition.getNext()[0]);
                    this.setPositionM(user.getPositionM());
                });
                
                addDrawable(particle);
            } else {
                return this.end();
            }
        }
        
        if(this.phase < 8) {
            let count = 2;
            
            for(let i = 0; i < count; ++i) {
                let particle = PolygonDrawable.from(makeRandomPolygon(16, 16, 16));
                
                particle.setLifespan(8);
                particle.setStyle(new ColorTransition([0, 0, 255, 0], [0, 255, 255, 1], particle.lifespan));
                particle.multiplySize(1/8);
                
                let angle = Math.random() * 2*Math.PI;
                
                let positionM = this.user.getPositionM();
                
                let positionTransition = new VectorTransition([irandom(16, 32) * Math.cos(angle) + positionM[0], irandom(16, 32) * Math.sin(angle) + positionM[1]], positionM, particle.lifespan);
                
                particle.controllers.add(function() {
                    this.setPositionM(positionTransition.getNext());
                });
                
                addDrawable(particle);
            }
        }
        
        if(this.phase == 16) {
            if(this.user.spendEnergy(this.getUseCost())) {
                let positionM = this.user.getPositionM();
                let direction = this.user.getCursorDirection();
                let startPosition = direction.normalized(rectangle_averageSize(this.user)/2).add(positionM);
                
                var projectile = RocketPunchProjectile.fromMiddle(startPosition, [8, 8]);
                
                projectile.setSpeed(direction.normalized(6));
                // projectile.setForce(projectile.speed.times(2));
                // projectile.addInteraction(new DragActor(projectile.speed.times(1)));
                projectile.launchDirection = projectile.speed;
                projectile.shareBlacklist(this.user.getBlacklist());
                
                addEntity(projectile);
                
                entityExplode.randomAngleVariation = 1;
                entityExplode(8, GoldSmokeParticle, startPosition, [12, 12], 1)
                .forEach(function(entity) {
                    entity.speed.multiply(Math.random() + 1);
                });
                
                this.user.setFace(projectile.speed[0]);
                
                this.user.drag(direction.normalized(-1));
            } else {
                this.setRemovable(true);
                this.end();
            }
        } else if(this.phase > 16) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
}

class MultiaimShots extends GoldAbility {
    constructor() {
        super();
    }
    
    use() {
        var x = this.user.getXM(), y = this.user.getYM();
        
        console.log(this.user.cursor.targets);
        
        for(var i = 0; i < this.user.cursor.collidedWith.length; ++i) {
            var projectile = Projectile.fromMiddle([x, y], [16, 16]);
            projectile.speed = Vector.subtraction(this.user.cursor.collidedWith[i].getPositionM(), this.user.getPositionM()).normalize(8);
            projectile.shareBlacklist(this.user.getBlacklist());
            projectile.setLifespan(30);
            addEntity(projectile);
        }
        
        return this;
    }
}

class GoldBurstHitbox extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.setLifespan(16);
        
        let c = false;
        
        function timing(t) {
            c = !c;
            
            if(c) {
                return Math.random();
            }
            
            return Math.random()*2;
        }
        
        this.setDrawable(PolygonDrawable.from(makeBurstPolygon2(new ColorTransition([2], [4], 8*2, function() {return Math.random();}), new ColorTransition([16], [20], 8*2, timing), 6)).rotate(Math.random()));
        this.drawable.initImaginarySize(rectangle_averageSize(this));
        this.drawable.setStyle(new ColorTransition([0, 255, 255, 0.875], [0, 0, 255, 1], 16, function(t) {return Math.pow(t, 3);}));
        
        let sizeTransition = new ColorTransition(this.size, Vector.multiplication(this.size, 1.5), 16, function(t) {return Math.pow(t, 1/1.5);});
        
        this.controllers.add(function() {
            this.setSizeM(sizeTransition.getNext());
        });
        
        this.drawable.setZIndex(-1);
        
        this.setTypeOffense(FX_GOLD_, 1);
    }
    
    updateDrawable() {
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}

class GoldenJab extends GoldAbility {
    constructor() {
        super();
    }
    
    use() {
        let averagesize = rectangle_averageSize(this.user);
        
        const direction = this.user.getCursorDirection();
        
        let positionM = direction.normalized(averagesize).add(this.user.getPositionM());
        
        let hitbox = GoldBurstHitbox.fromMiddle(positionM, [averagesize, averagesize]);
        hitbox.shareBlacklist(this.user.getBlacklist());
        hitbox.setSpeed(direction.normalized(ALMOST_ZERO));
        
        addEntity(hitbox);
        
        this.end();
        
        return this;
    }
}
