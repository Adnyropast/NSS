
const ENETRA_DEF = new ColorTransition([255, 0, 0, 1], [0, 255, 0, 1]);

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
}

const AS_CHARACTER = set_gather(AS_FOCUS, "followMe", AS_MOVEMENT, AS_ROUTE, ACT_JUMP);

class Character extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setCollidable(true);
        this.setZIndex(0);
        
        this.cursor = Cursor.fromMiddle([this.getXM(), this.getYM()], [this.getWidth(), this.getHeight()]);
        this.cursor.shareBlacklist(this.getBlacklist());
        
        // this.uiEnergy = new TextDrawable();
        this.energyBar = new EnergyBarDrawable([0, 0], [36, 12]);
        
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
    }
    
    onadd() {
        addEntity(this.cursor);
        
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

class EntityCharge extends Action {
    constructor(typeDamage) {
        super();
        this.setId("entityCharge");
        
        this.hitbox = new Entity([0, 0], [0, 0]);
        this.hitbox.addInteraction(new TypeDamager(typeDamage));
        this.hitbox.addInteraction(new VacuumDragActor(-2));
        this.hitbox.setLifespan(32);
        
    }
    
    use() {
        if(this.phase == 0) {
            this.hitbox.size = this.user.size;
            this.hitbox.position = this.user.position;
            this.hitbox.shareBlacklist(this.user.getBlacklist());
            addEntity(this.hitbox);
        } else if(this.phase == 24) {
            this.end();
        }
        
        return this;
    }
    
    onend() {
        removeEntity(this.hitbox);
        
        return super.onend();
    }
}
