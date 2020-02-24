
const AS_CHARACTER = set_gather(AS_FOCUS, "followMe", AS_MOVEMENT, AS_ROUTE, AS_JUMP, "stunState", "smoke", "regeneration");

class Character extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setCollidable(true);
        this.setZIndex(0);
        
        this.cursor = new Cursor(position, size);
        
        this.energyBar = new EnergyBarDrawable([0, 0], [36, 12]);
        this.energyBar.setProperWidth(rectangle_averageSize(this));
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new BrakeRecipient());
        this.addInteraction(new DragRecipient());
        this.addInteraction(new GravityRecipient());
        this.addInteraction(new GroundRecipient());
        this.addInteraction(new ThrustActor(0.5));
        
        this.addInteraction(new TypeDamageable());
        this.addInteraction(new WaterRecipient());
        
        this.setBattler(Battler.fromEntity(this));
        
        this.addActset(AS_CHARACTER);
        
        this.addInteraction(new ContactVanishActor(CVF_CHARACTER));
        
        this.addInteraction(new WallRecipient());
        this.addInteraction(new LadderRecipient());
        this.addInteraction(new AirStateReceiver());
        
        this.faceSave = FRIGHT;
        
        this.setStats({
            "walk-speed": {
                "real": 0.5,
                "effective": 0.5,
                "effectiveLock": false
            },
            "walk-speed-tired": {
                // "real": 0.25,
                "real": 0.5,
                "effective": 0.5,
                "effectiveLock": false
            },
            "air-speed": {
                "real": 0.5,
                "effective": 0.5,
                "effectiveLock": false
            },
            "swim-speed": {
                "real": 0.5,
                "effective": 0.5,
                "effectiveLock": false
            },
            
            "climb-speed": {
                "real": 1,
                "effective": 1,
                "effectiveLock": false
            },
            // "jump-force": 1.875,
            "jump-force": 1.5,
            "regeneration": 0.0625,
            
            "walljump-angle": 0.39269908169872414,
            // "walljump-force": 1.5,
            "walljump-force": 1.9375,
            "midairJump-count": 0,
            
            "jumps": [
                {"force": 1.5}
            ],
            
            "walljump": {
                "force": 1.9375,
                "angle": 0.39269908169872414
            }
        });
        
        this.controllers.add(healController);
        
        this.equipments = {
            "consumable" : null,
            "head" : null,
            "body" : null,
            "sword" : null,
            "shield" : null,
            "spear" : null,
            "hammer" : null,
            "bow" : null,
            "arrows" : null,
        };
        
        this.setEventListener("defeat", "vanish", function() {
            const positionM = this.getPositionM();
            const size = this.size;
            const avgsz = rectangle_averageSize(this);
            
            makeBurstEffect(CharacterVanishParticle, positionM, size, this.speed);
            
            makeShockwave.lifespan = 48;
            makeShockwave.lineWidth = avgsz/4;
            makeShockwave(positionM, avgsz/2)
            .getDrawable()
            .setStyle(new ColorTransition(CV_WHITE, [0, 0, 0, 0], 48, powt(1/4)));
        });
    }
    
    static fromData(data) {
        let character = super.fromData(data);
        
        character.cursor.setPositionM(character.getPositionM());
        
        return character;
    }
    
    onadd() {
        addEntity(this.cursor);
        this.cursor.shareBlacklist(this.getBlacklist());
        
        NONOBSTACLES.add(this);
        
        return super.onadd();
    }
    
    onremove() {
        removeEntity(this.cursor);
        removeDrawable(this.energyBar);
        
        return super.onremove();
    }
    
    updateDrawable() {
        const energyRatio = this.getEnergyRatio();
        
        if(energyRatio < 1) {
            this.energyBar.setXM(this.getXM());
            this.energyBar.setY2(this.getY1());
            this.energyBar.setEnergyRatio(energyRatio);
            
            addDrawable(this.energyBar);
        } else {
            removeDrawable(this.energyBar);
        }
        
        return super.updateDrawable();
    }
    
    setFace(face) {
        if(face === FRIGHT || face > 0) {
            this.faceSave = FRIGHT;
        } else if(face === FLEFT || face < 0) {
            this.faceSave = FLEFT;
        }
        
        return this;
    }
    
    onbump(event) {
        const obstacle = event.obstacle;
        
        let norm = this.speed.getNorm();
        
        let avgsz = rectangle_averageSize(this);
        
        const vector = vector_fromDirections(getDD(this.locate(obstacle)), this.getDimension()).normalize(avgsz/2);
        
        let positionM = Vector.addition(this.getPositionM(), vector);
        
        let particle = SpikeSmokeParticle.fromMiddle(positionM, [norm, norm]);
        
        particle.setSpeed(this.speed.normalized(-0.5));
        
        // particle.resetSpikeDrawable(irandom(6, 9), new ColorTransition([-Math.PI/2], [+Math.PI/2]), irandom(8, 10), irandom(16, 18), 6);
        particle.resetSpikeDrawable(irandom(7, 9), new ColorTransition([-Math.PI/2], [+Math.PI/2]), function() {return irandom(8, 10);}, function() {return irandom(14, 18);}, 6);
        
        // addEntity(particle);
        
        /**
        
        let count = irandom(2, 3);
        let direction = this.speed.rotated(Math.PI/2).normalize(avgsz/2);
        
        for(let i = 0; i < count; ++i) {
            let d = direction.rotated(random(-0.5, +0.5));
            
            let smokeParticle = SmokeParticle.fromMiddle(Vector.addition(positionM, d), [norm, norm]);
            smokeParticle.drawable.setStyle("black");
            
            smokeParticle.setSpeed(d.normalized(random(0.75, 1.75)));
            
            addEntity(smokeParticle);
        }
        
        direction = this.speed.rotated(-Math.PI/2).normalize(avgsz/2);
        
        for(let i = 0; i < count; ++i) {
            let d = direction.rotated(random(-0.5, +0.5));
            
            let smokeParticle = SmokeParticle.fromMiddle(Vector.addition(positionM, d), [norm, norm]);
            smokeParticle.drawable.setStyle("black");
            
            smokeParticle.setSpeed(d.normalized(random(0.75, 1.75)));
            
            addEntity(smokeParticle);
        }
        
        /**/
        
        entityExplode.initialDistance = this.getWidth()/2;
        entityExplode.initialAngle = Math.PI/12;
        entityExplode.xRadius = 0.25;
        entityExplode.radiusRotate = this.speed.getAngle();
        entityExplode(12, SmokeParticle, positionM, [norm, norm], 1)
        .forEach(function(entity) {
            // entity.speed.multiply(random(1.25, 1.75));
            entity.speed.multiply(random(norm * 0.25, norm * 0.5));
            // entity.drawable.style = "blue";
        });
        
        /**/
        
        directionSparks.randomAngleVariation = 0.5;
        directionSparks(8, PebbleParticle, positionM, [norm/3, norm/3], this.speed.normalized(-1))
        .forEach(function(entity) {
            entity.speed.multiply(random(1, 2));
        });
        
        /**/
        
        return this;
    }
    
    initPositionM(positionM) {
        this.setPositionM(...arguments);
        this.cursor.setPositionM(...arguments);
        
        return this;
    }
    
    getViewType() {
        return this.getGravityDirection().isZero() ? "topdown" : "side";
    }
    
    resetJumps() {
        this.replaceStateObject({name:"midairJump", count:this.stats["midairJump-count"]});
        
        return this;
    }
}



class Cursor extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setCollidable(true);
        this.setSelfBrake(1.25);
        // this.drawable = null;
        // this.setZIndex(-101);
        // this.setStyle(INVISIBLE);
        
        this.target = null;
        this.targets = new SetArray();
        this.currentIndex = -1;
        this.detect = console.warn.bind(console.warn, "Cursor.prototype.detect");
        this.targeted = new SetArray();
        
        this.controllers.add(function() {
            if(this.target != null) {
                let targetPositionM = this.target.getPositionM();
                let vector = Vector.subtraction(targetPositionM, this.getPositionM());
                
                if(vector.getNorm() < ALMOST_ZERO) {
                    this.setPositionM(targetPositionM);
                } else {
                    this.speed.set(vector.divide(1.5));
                }
            } else if(this.destination != null) {
                let vector = Vector.subtraction(this.destination, this.getPositionM());
                
                if(vector.getNorm() < ALMOST_ZERO) {
                    this.setPositionM(this.destination);
                } else {
                    this.speed.set(vector.divide(1.5));
                }
            }
        });
    }
    
    centerTarget() {
        const worldEntities = this.getWorldEntities();
        
        if(!worldEntities.includes(this.target)) {
            this.target = null;
        }
        
        if(this.target != null) {
            // this.setPositionM(this.target.getPositionM());
        }
        
        return this;
    }
    
    setNextTarget() {
        const worldEntities = this.getWorldEntities();
        
        var targets = [];
        
        for(var i = 0; i < this.collidedWith.length; ++i) {
            if(this.detect(this.collidedWith[i])) {
                if(!this.targeted.includes(this.collidedWith[i])) {
                    targets.push(this.collidedWith[i]);
                }
            }
        }
        
        if(targets.length == 0 && this.targeted.length > 0) {
            this.targeted.splice(0, this.targeted.length);
            return this.setNextTarget();
        } if(targets.length > 0) {
            this.targeted.push(this.target = targets[0]);
        }
        
        /**
        
        if(this.targets.length > 0) {
            ++this.currentIndex;
            this.currentIndex %= this.targets.length;
            
            this.target = this.targets[0];
            this.targets.splice(0, 1);
            // this.setPositionM(this.targets[this.currentIndex].getPositionM());
            
            if(worldEntities.indexOf(this.target) == -1) {
                this.setNextTarget();
            }
        }
        
        /**/
        
        return this;
    }
    
    setDetectFunction(detect) {
        this.detect = detect;
        
        return this;
    }
    
    updateDrawable() {
        const positionM = this.getPositionM();
        
        for(let i = 0; i < this.drawables.length; ++i) {
            this.drawables[i].setPositionM(positionM);
        }
        
        return super.updateDrawable();
    }
}

class CharacterVanishParticle extends SmokeParticle {
    constructor() {
        super(...arguments);
        
        this.removeInterrecipientWithId("replace");
        this.accelerators.add([0, -0.0625]);
        this.setSelfBrake(1.0625);
        
        this.setLifespan(irandom(24, 64));
        this.sizeTransition.duration = this.lifespan;
        
        this.drawable.setStyle(new ColorTransition(CV_WHITE, CV_BLACK, this.lifespan));
        this.drawable.setStrokeStyle(new ColorTransition([223, 223, 223, 1], [0, 0, 0, 0.5], this.lifespan));
    }
}
