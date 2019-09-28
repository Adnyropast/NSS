
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
    
    setEnergyRatio(energyRatio) {this.energyRatio = energyRatio; return this}
    
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

const AS_CHARACTER = set_gather(AS_FOCUS, "followMe", AS_MOVEMENT, AS_ROUTE, AS_JUMP, "stunState");

class Character extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setCollidable(true);
        this.setZIndex(0);
        
        this.cursor = Cursor.fromMiddle([this.getXM(), this.getYM()], [this.getWidth(), this.getHeight()]);
        this.cursor.shareBlacklist(this.getBlacklist());
        
        // this.uiEnergy = new TextDrawable();
        this.energyBar = new EnergyBarDrawable([0, 0], [36, 12]);
        
        this.energyBar.setProperWidth(rectangle_averagesize(this));
        
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
        this.addInteraction(new SoftReplaceRecipient());
        
        this.addInteraction(new WallRecipient());
        this.addInteraction(new LadderRecipient());
        
        this.faceSave = "right";
        
        this.stats = {};
        this.stats["walk-speed"] = 0.5;
        this.stats["walk-speed-tired"] = 0.25;
        this.stats["air-speed"] = 0.5;
        this.stats["swim-speed"] = 0.5;
        
        this.addInteraction(new StunRecipient(1));
        
        this.stats["climb-speed"] = 0.25;
        this.stats["jump-force"] = 1.875;
        this.stats["regeneration"] = 0.0625;
    }
    
    static fromData(data) {
        let character = super.fromData(data);
        
        character.cursor.setPositionM(character.getPositionM());
        
        return character;
    }
    
    onadd() {
        addEntity(this.cursor);
        
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
        if(face === "right" || face > 0) {
            this.faceSave = "right";
        } else if(face === "left" || face < 0) {
            this.faceSave = "left";
        }
        
        return this;
    }
    
    onland(obstacle) {
        let norm = this.speed.getNorm();
        
        let directions = getDD(this.locate(obstacle));
        let vector = new Vector(0, 0);
        
        let averagesize = rectangle_averagesize(this);
        
        for(let i = 0; i < directions.length; ++i) {
            vector[directions[i].dimension] += directions[i].sign * averagesize/2;
        }
        
        let positionM = Vector.addition(this.getPositionM(), vector);
        
        let particle = SpikeSmokeParticle.fromMiddle(positionM, [norm, norm]);
        
        particle.setSpeed(this.speed.normalized(-0.5));
        
        // particle.resetSpikeDrawable(irandom(6, 9), new ColorTransition([-Math.PI/2], [+Math.PI/2]), irandom(8, 10), irandom(16, 18), 6);
        particle.resetSpikeDrawable(irandom(6, 9), new ColorTransition([-Math.PI/2], [+Math.PI/2]), function() {return irandom(8, 10);}, function() {return irandom(14, 18);}, 6);
        
        addEntity(particle);
        
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
        this.targeted = [];
    }
    
    centerTarget() {
        if(!ENTITIES.includes(this.target)) {
            this.target = null;
        }
        
        if(this.target != null) {
            this.setPositionM(this.target.getPositionM());
        }
        
        return this;
    }
    
    setNextTarget() {
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
            
            if(ENTITIES.indexOf(this.target) == -1) {
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
}

class FocusClosest extends FocusAction {
    use() {
        if(this.user.cursor == null) return this.end("no cursor");
        if(this.user.cursor.targets.length == 0) return this.end("no targets");
        
        this.user.cursor.target = this.user.cursor.targets[0];
        var max = Vector.distance(this.user.cursor.target.getPositionM(), this.user.getPositionM());
        
        for(var i = 1; i < this.user.cursor.targets.length; ++i) {
            var distance = Vector.distance(this.user.cursor.targets[i].getPositionM(), this.user.getPositionM());
            
            if(distance < max) {
                max = distance;
                this.user.cursor.target = this.user.cursor.targets[i];
            }
        }
        
        this.user.cursor.centerTarget();
        
        return this;
    }
}

class EntityCharge extends BusyAction {
    constructor(typeDamage) {
        super();
        this.setId("entityCharge");
        
        this.hitbox = new Hitbox([0, 0], [0, 0]);
        this.hitbox.addInteraction(new TypeDamager(typeDamage));
        this.hitbox.addInteraction(new VacuumDragActor(-2));
        this.hitbox.setLifespan(16);
        this.hitbox.addInteraction(new StunActor(12));
    }
    
    use() {
        if(this.phase == 0) {
            this.hitbox.size = this.user.size;
            this.hitbox.position = this.user.position;
            this.hitbox.shareBlacklist(this.user.getBlacklist());
            addEntity(this.hitbox);
            
            let thrust = this.user.findState("thrust");
            
            if(typeof thrust == "undefined") {thrust = 0;}
            else {thrust = thrust.value;}
            
            this.user.drag(this.user.getCursorDirection().normalize(thrust * 16));
            
            this.setRemovable(false);
        } else if(this.phase == 24) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
    
    onend() {
        removeEntity(this.hitbox);
        
        return super.onend();
    }
}
