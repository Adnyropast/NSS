
const ENETRA_DEF = new ColorTransition([255, 0, 0, 1], [0, 255, 0, 1]);

const EBAR_HEIGHTPROP = 12/36;
const EBAR_BORDERPROP = 4/36;

class EnergyBarDrawable extends RectangleDrawable {
    constructor(position, size = [36, 12]) {
        super(position, size);
        this.setZIndex(-200);
        this.setStyle("#00003F");
        this.colorTransition = ENETRA_DEF;
        this.borderWidth = 4;
        this.energyRatio = 1;
        
        this.energyBar = new RectangleDrawable(position, size);
    }
    
    setCameraMode() {
        super.setCameraMode(...arguments);
        this.energyBar.setCameraMode(...arguments);
        
        return this;
    }
    
    setEnergyTransition(colorTransition) {this.colorTransition = colorTransition; return this;}
    
    setEnergyRatio(energyRatio) {
        this.energyRatio = energyRatio;
        
        if(this.energyRatio < 0) {
            this.energyRatio = 0;
        }
        
        return this;
    }
    
    draw(context) {
        super.draw(context);
        
        this.energyBar.setStyle(this.colorTransition.getStyleAt(this.energyRatio));
        
        this.energyBar.setWidth(this.energyRatio * (this.getWidth() - this.borderWidth));
        this.energyBar.setHeight(this.getHeight() - this.borderWidth);
        this.energyBar.setX(this.getX() + this.borderWidth / 2);
        this.energyBar.setYM(this.getYM());
        
        this.energyBar.draw(context);
        
        return this;
    }
    
    setBorderWidth(borderWidth) {this.borderWidth = borderWidth;}
    
    setCamera(camera) {
        super.setCamera(camera);
        this.energyBar.setCamera(camera);
        
        return this;
    }
    
    setProperWidth(width, heightProp = EBAR_HEIGHTPROP, borderProp = EBAR_BORDERPROP) {
        this.setWidth(width).setHeight(width * heightProp).setBorderWidth(width * borderProp);
        
        return this;
    }
}

const AS_CHARACTER = set_gather(AS_FOCUS, "followMe", AS_MOVEMENT, AS_ROUTE, AS_JUMP, "stunState", "smoke", "regeneration");

class Character extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setCollidable(true);
        this.setZIndex(0);
        
        this.cursor = Cursor.fromMiddle([this.getXM(), this.getYM()], [this.getWidth(), this.getHeight()]);
        
        // this.uiEnergy = new TextDrawable();
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
        
        this.addInteraction(new ContactVanishActor(2));
        
        this.addInteraction(new WallRecipient());
        this.addInteraction(new LadderRecipient());
        
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
        
        this.addInteraction(new StunRecipient(1));
        
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
        /**
        this.uiEnergy.content = "Energy : " + this.energy;
        this.uiEnergy.color = "rgba(" + (255 - 255 * this.getEnergyRatio()) + ", " + (255 * this.getEnergyRatio()) + ", 0)";
        this.uiEnergy.x = this.getXM();
        this.uiEnergy.y = this.getYM();
        /**
        var text = makeTextCanvas("Energy : " + this.energy, "Luckiest Guy", "rgba(" + (255 - 255 * this.getEnergyRatio()) + ", " + (255 * this.getEnergyRatio()) + ", 0)");
        this.uiEnergy.setStyle(text);
        this.uiEnergy.setWidth(text.width / 16);
        this.uiEnergy.setHeight(text.height / 16);
        this.uiEnergy.setXM(this.getXM());
        this.uiEnergy.setY2(this.getY());
        /**/
        
        var energyRatio = this.getEnergyRatio();
        
        if(energyRatio < 1) {
            addDrawable(this.energyBar);
            
            this.energyBar.setXM(this.getXM());
            this.energyBar.setY2(this.getY());
            this.energyBar.setEnergyRatio(energyRatio);
        } else {
            removeDrawable(this.energyBar);
        }
        
        /**/
        
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
        entityExplode.initialDistance = 0;
        entityExplode.xRadius = 1;
        entityExplode.radiusRotate = 0;
        
        /**/
        
        directionSparks.randomAngleVariation = 0.5;
        directionSparks(8, Entity, positionM, [norm/3, norm/3], this.speed.normalized(-1))
        .forEach(function(entity) {
            entity.setLifespan(32);
            entity.setSelfBrake(1.03125);
            entity.speed.multiply(random(1, 2));
            entity.addInteraction(new DragRecipient(0.125));
            entity.drawable.style = "gray";
        });
        directionSparks.randomAngleVariation = 0;
        
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
