
const AS_CUTTER = set_gather("cutterBoomerang", "cutterDash", "finalCutter1", "finalCutter2", "finalCutter3", "autoCutter", "finalCutter4", "finalCutter5");

class CutterAbility extends BusyAction {
    constructor() {
        super();
    }
}

const cutterdrawable = new PolygonDrawable([[16, 0], [12, 4], [8, 8], [-8, 16], [0, 0], [-8, -16], [8, -8], [12, -4]]);

const cutterEdgeStyle = new ColorTransition([255, 223, 0, 1], [255, 223, 0, 0], 16);

class Cutter extends Hitbox {
    constructor() {
        super(...arguments);
        
        // this.setStyle("cyan");
        this.addInteraction(new TypeDamager({"type" : FX_SHARP, "value" : 0.125}).setRehit(9));
        this.addInteraction(new ContactVanishRecipient(1));
        
        this.addActset(AS_MOVEMENT);
        
        this.trailDrawable = new TrailDrawable();
        this.trailDrawable.edgeStyle = cutterEdgeStyle;
        this.angle = 0;
        
        this.previousPositionM = null;
        
        this.setLifespan(64);
        /**
        let t = 0;
        
        this.controllers.add(function controller(entity) {
            ++t;
            
            if(t % 9 == 0) {
                this.addInteraction(new TypeDamager({"type" : FX_SHARP, "value" : 0.125}));
                this.addInteraction(new DragActor(this.speed.normalized(0.125)));
            }
        });
        /**/
        this.bladeDrawable = PolygonDrawable.from(cutterdrawable).multiplySize(1/2);
        this.bladeDrawable.setPositionM(this.getPositionM());
        this.bladeDrawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 1], 64));
        this.bladeDrawable.setStyle(new ColorTransition([255, 191, 63, 1], [255, 191, 63, 0], 64));
        
        this.addInteraction(new VacuumDragActor(-0.125));
    }
    
    updateDrawable() {
        let positionM = this.getPositionM();
        
        let positionTransition = new ColorTransition(positionM, positionM);
        
        if(this.previousPositionM != null) {positionTransition = new ColorTransition(this.previousPositionM, positionM)}
        
        let rotation = 2*Math.PI/6;
        let det = 12;
        
        for(let i = 0; i < det; ++i) {
            this.angle += rotation/det;
            
            let closePoint = positionTransition.at((i+1)/det);
            
            let farWidth = Math.cos(this.angle) * 2 + 8;
            
            if(i/det == 1) {
                this.trailDrawable.trailStyle = cutterEdgeStyle;
            } else {
                this.trailDrawable.trailStyle = new ColorTransition([255, 255, 255 * i/det, 1], [127, 127, 63 + (255 - 63) * i/det, 0], 8);
            }
            this.trailDrawable.addSized(closePoint, this.angle, farWidth, farWidth - 1);
        }
        
        this.bladeDrawable.setPositionM(this.getPositionM());
        this.bladeDrawable.rotate(rotation);
        
        this.previousPositionM = positionM;
        
        return super.updateDrawable();
    }
    
    onadd() {
        addDrawable(this.trailDrawable);
        addDrawable(this.bladeDrawable);
        
        return super.onadd();
    }
    
    onremove() {
        removeDrawable(this.trailDrawable);
        removeDrawable(this.bladeDrawable);
        
        return super.onremove();
    }
}

class CutterBoomerang extends CutterAbility {
    constructor() {
        super();
        this.setId("cutterBoomerang");
        
        this.setUseCost(2);
    }
    
    use() {
        if(this.phase == 0) {
            if(this.user.energy > this.getUseCost()) {
                this.user.hurt(this.getUseCost());
            } else {
                this.end();
            }
        }
        
        if(this.phase < 10) {
            
        }
        if(this.phase == 10) {
            var boomerang = Cutter.fromMiddle(this.user.getPositionM(), [16, 8]);
            let speed = this.user.getCursorDirection().normalize(8);
            
            boomerang.setSpeed(speed);
            boomerang.route = this.user.getPositionM();
            boomerang.addAction(new LinearMovement(speed.normalized(-0.5)));
            boomerang.shareBlacklist(this.user.getBlacklist());
            
            addEntity(boomerang);
            
            this.user.setFace(speed[0]);
            
            this.end();
        }
        
        return this;
    }
}

class CutterDash extends SlashAction {
    constructor() {
        super();
        this.setId("cutterDash");
        
        this.direction = null;
        this.damageableSave = null;
        this.cutterDamager = new TypeDamager([{"type" : FX_SHARP, "value" : 4}]);
        
        this.setUseCost(4);
        
        
        
        this.slashDuration = 16;
        this.endlag = 8;
        this.trailDrawable.edgeStyle = ColorTransition.from(cutterEdgeStyle).setDuration(32);
    }
    
    use() {
        let thrust = this.user.findState("thrust");
        
        if(typeof thrust == "undefined") {thrust = 0;}
        else {thrust = thrust.value;}
        
        if(this.phase == 0) {
            if(this.user.getEnergy() > this.getUseCost()) {
                this.direction = this.user.getCursorDirection().normalize(thrust * 4);
                
                this.user.setFace(this.direction[0]);
                
                this.setRemovable(false);
                
                // this.user.hurt(this.getUseCost());
            } else {
                return this.end();
            }
        }
        if(this.phase < 16) {
            this.user.drag(this.direction.normalize(thrust * 2));
        }
        
        if(this.phase == 24) {
            this.setRemovable(true);
            return this.end();
        }
        
        return super.use();
    }
    
    onadd() {
        this.damageableSave = this.user.findInterrecipientWithId("damage");
        this.user.removeInterrecipientWithId("damage");
        // this.user.addInteraction(this.cutterDamager);
        
        return this;
    }
    
    onend() {
        this.user.addInteraction(this.damageableSave);
        // this.user.removeInteractorWithId("damage");
        
        return this;
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        
        let angle = face.getAngle();
        
        this.baseAngleTransition = new ColorTransition([angle - Math.PI/2], [angle + Math.PI/2]);
        this.baseDistanceTransition = new ColorTransition([6], [6]);
        this.bladeAngleTransition = new ColorTransition([angle - Math.PI], [angle + 1/4*Math.PI]);
        this.bladeWidthTransition = new ColorTransition([16], [16]);
        
        return this;
    }
    
    updateTrailDrawableStyle(detProgress) {
        if(detProgress == 1) {
            this.trailDrawable.trailStyle = new ColorTransition([255, 255, 127, 1], [0, 255, 255, 0], 12);
            this.trailDrawable.trailStyle = ColorTransition.from(cutterEdgeStyle).setDuration(32);
        } else {
            this.trailDrawable.trailStyle = new ColorTransition([127*detProgress, 255, 255, 1], [0, 0, 255, 0], 8);
            this.trailDrawable.trailStyle = new ColorTransition([255, 255, 255 * detProgress, 1], [127, 127, 63 + (255 - 63) * detProgress, 0], 24);
        }
        
        return this;
    }
}

function finalCutter1BladeTransition(t) {
    let shiftTime = 0.125 + 0.0625 + 0.03125 + 0.015625;
    
    if(t < shiftTime) {
        return 1;
    }
    
    let rt = (t - shiftTime) / (1-shiftTime);
    
    return Math.pow(Math.abs(rt - 0.5) / 0.5, 3);
    return 1 * (Math.cos(rt * 2*Math.PI) + 1) / 4 + 0.5;
    return 1 * forthBackTiming(rt);
}

class FinalCutter1 extends SlashAction {
    constructor() {
        super();
        this.setId("finalCutter1");
        
        this.trailDrawable.edgeStyle = cutterEdgeStyle;
        
        this.face = null;
        this.type = "";
        
        this.slashDuration = 10;
        
        this.baseDistanceTransition = new ColorTransition([6], [2], 1, forthBackTiming);
        
        this.det = 12;
        this.hitbox.setLifespan(this.slashDuration + 1);
        
        this.followup = FinalCutter2;
        
        this.hitbox.addInteraction(new StunActor(64));
        this.endlag = 16;
        
        this.setUseCost(3);
    }
    
    updateTrailDrawableStyle(detProgress) {
        if(detProgress == 1) {
            this.trailDrawable.trailStyle = new ColorTransition([255, 255, 127, 1], [0, 255, 255, 0], 12);
            this.trailDrawable.trailStyle = cutterEdgeStyle;
        } else {
            this.trailDrawable.trailStyle = new ColorTransition([127*detProgress, 255, 255, 1], [0, 0, 255, 0], 8);
            this.trailDrawable.trailStyle = new ColorTransition([255, 255, 255 * detProgress, 1], [127, 127, 63 + (255 - 63) * detProgress, 0], 8);
        }
        
        return this;
    }
    
    transitionsSetup() {
        this.face = this.user.getCursorDirection();
        this.face[0] = Math.sign(this.face[0]);
        
        if(this.face[0] != 0) {
            this.type = "horizontal";
            
            this.startBaseAngle = (new Vector(0, -1)).getAngle();
            this.endBaseAngle = this.face[0] > 0 ? -2 * Math.PI : Math.PI;
            this.endBaseAngle = this.startBaseAngle + this.face[0] * 6/4 * Math.PI;
            
            this.baseAngleTransition = new ColorTransition([this.startBaseAngle], [this.endBaseAngle], 1, Math.sqrt);
            
            this.baseDistanceTransition = new ColorTransition([6], [2], 1, function(t) {if(t > 0.5) {return 0} return forthBackTiming(t)});
            
            this.startBladeAngle = new Vector(-this.face[0], 0).getAngle();
            this.endBladeAngle = this.face[0] > 0 ? 3 * Math.PI : -2*Math.PI;
            this.endBladeAngle = this.startBladeAngle + this.face[0] * 8/4 * Math.PI;
            
            this.bladeAngleTransition = new ColorTransition([this.startBladeAngle], [this.endBladeAngle], 1, Math.sqrt);
            
            this.bladeWidthTransition = new ColorTransition([0], [16], 1, finalCutter1BladeTransition);
            
            this.hitbox.addInteraction(new DragActor([this.face[0] * 0.125, 0]));
        } else if(this.face[1] != 0) {
            this.type = "vertical";
        } else {
            this.type = "central";
        }
        
        return this;
    }
    
    use() {
        /**
        
        let duration = this.slashDuration;
        
        if(this.phase <= duration) {
            let det = 12;
            
            let positionTransition = new ColorTransition(this.lastPositionM || this.user.getPositionM(), this.user.getPositionM());
            
            for(let i = 1; i <= det; ++i) {
                let progress = (this.phase-1 + i/det) / duration;
                if(progress < 0) progress = 0;
                let baseAngle = this.startBaseAngle + Math.pow(progress, 1/2) * (this.endBaseAngle - this.startBaseAngle);
                
                let baseDistance = 8;this.baseDistanceTransition.at(progress)[0];
                
                let baseDirection = new Vector(Math.cos(baseAngle), Math.sin(baseAngle));
                
                let basePosition = Vector.addition(positionTransition.at(i/det), baseDirection.normalized(baseDistance));
                
                let bladeAngle = this.startBladeAngle + Math.pow(progress, 1/2) * (this.endBladeAngle - this.startBladeAngle);
                
                let bladeWidth = 16 * finalCutter1BladeTransition(progress);
                
                this.hitbox.setPositionM(basePosition.plus(baseDirection.normalized((20 + baseDistance) / 2)));
                
                this.trailDrawable.trailStyle = new ColorTransition([127*i/det, 255, 255, 1], [0, 0, 255, 0], 8);
                
                if(i == det) this.trailDrawable.trailStyle = new ColorTransition([255, 255, 127, 1], [0, 255, 255, 0], 12);
                
                this.trailDrawable.addSized(basePosition, bladeAngle, bladeWidth + baseDistance, bladeWidth - 1.25 + baseDistance);
            }
            
            this.lastPositionM = this.user.getPositionM();
        }
        
        if(this.phase == duration + 4) {
            this.end();
        }
        
        /**/
        
        super.use()
        
        if(this.phase == this.startlag + this.slashDuration + 4 && this.nextAction) {this.setRemovable(true); this.end()}
        
        return this;
    }
    
    preventsAddition(action) {
        if(this.phase > this.startlag + this.slashDuration && AS_CUTTER.includes(action.getId()) && typeof this.followup == "function") {
            this.nextAction = new this.followup();
        }
        
        return super.preventsAddition(action);
    }
    
    onend() {
        this.preventsAddition = function() {return false};
        
        if(this.nextAction instanceof Action) {
            this.user.addAction(this.nextAction);
        } else if(typeof this.nextAction == "function") {
            this.user.addAction(new this.nextAction());
        }
        
        return super.onend();
    }
}

function finalCutter2BladeTransition(t) {
    let tmpr = Math.abs(t - 0.5) / 0.5;
    tmpr = Math.abs(tmpr - 0.5) / 0.5;
    tmpr = Math.pow(tmpr, 3);
    // addEntity(Entity.fromMiddle([t*16, tmpr*16], [2, 2]).setStyle("red").setLifespan(16));
    
    return tmpr;
    return Math.abs(Math.cos(t * 2*Math.PI));
    return Math.pow((tmpr - 0.5) / 0.5, 2);
    return Math.min(1, forthBackTiming(Math.abs(t - 0.5) / 0.5));
}

class FinalCutter2 extends FinalCutter1 {
    constructor() {
        super();
        this.setId("finalCutter2");
        
        this.face = null;
        this.type = "";
        
        this.slashDuration = 10;
        this.hitbox.setLifespan(this.slashDuration + 1);
        
        this.followup = FinalCutter3;
    }
    
    transitionsSetup() {
        this.face = this.user.getCursorDirection();
        
        if(this.face[0] != 0) {
            this.type = "horizontal";
            
            this.face[0] = Math.sign(this.face[0]);
            
            this.startBaseAngle = (new Vector(-this.face[0], 0)).getAngle();
            this.endBaseAngle = this.startBaseAngle - this.face[0] * 2 * Math.PI;
            
            this.baseAngleTransition = new ColorTransition([this.startBaseAngle], [this.endBaseAngle]);
            
            this.baseDistanceTransition = new ColorTransition([6], [2], 1, forthBackTiming);
            
            this.startBladeAngle = new Vector(-this.face[0], 0).getAngle();
            this.endBladeAngle = this.startBladeAngle - this.face[0] * 2 * Math.PI;
            
            this.bladeAngleTransition = new ColorTransition([this.startBladeAngle], [this.endBladeAngle]);
            
            this.bladeWidthTransition = new ColorTransition([0], [16], 1, finalCutter2BladeTransition);
        } else if(this.face[1] != 0) {
            this.type = "vertical";
        } else {
            this.type = "central";
        }
        
        return this;
    }
    
    use() {
        /**
        
        let duration = this.slashDuration;
        
        if(this.phase <= duration) {
            let det = 6;
            
            let positionTransition = new ColorTransition(this.lastPositionM || this.user.getPositionM(), this.user.getPositionM());
            
            for(let i = 1; i <= det; ++i) {
                let progress = (this.phase-1 + i/det) / duration;
                
                let baseAngle = this.startBaseAngle + bezierLinear(progress) * (this.endBaseAngle - this.startBaseAngle);
                
                let baseDistance = 6 - 4 * Math.abs((this.phase-1 + i/det) - duration/2) / (duration/2);
                
                let baseDirection = new Vector(Math.cos(baseAngle), Math.sin(baseAngle));
                
                let basePosition = Vector.addition(positionTransition.at(i/det), baseDirection.normalized(baseDistance));
                
                this.hitbox.setPositionM(basePosition.plus(baseDirection.normalized((20 + baseDistance) / 2)));
                
                let bladeAngle = this.startBladeAngle + bezierLinear(progress) * (this.endBladeAngle - this.startBladeAngle);
                
                let bladeWidth = 16 * finalCutter2BladeTransition((this.phase-1 + i/det) / duration);
                
                this.trailDrawable.trailStyle = new ColorTransition([127*i/det, 255, 255, 1], [0, 0, 255, 0], 16);
                
                if(i == det) this.trailDrawable.trailStyle = new ColorTransition([255, 255, 127, 1], [0, 255, 255, 0], 20);
                
                this.trailDrawable.addSized(basePosition, bladeAngle, bladeWidth + baseDistance, bladeWidth - 1.25 + baseDistance);
            }
        }
        
        if(this.phase == duration + 4) {
            this.end();
        }
        
        /**/
        
        return super.use();
    }
}

class FinalCutter3 extends FinalCutter2 {
    constructor() {
        super();
        this.setId("finalCutter3");
        
        this.slashDuration = 12;
        
        this.hitbox.setLifespan(this.slashDuration + 1);
        
        this.followup = null;
        this.nextAction = FinalCutter4;
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        
        if(face[0] != 0) {
            let frontAngle = Math.PI/2 + face[0] * Math.PI/2;
            
            let startBaseAngle = Math.PI/2 + face[0] * Math.PI/2;
            let endBaseAngle = startBaseAngle - face[0] * 6/8 * 2*Math.PI;
            
            this.baseAngleTransition = new ColorTransition([startBaseAngle], [endBaseAngle], 1, Math.sqrt);
            
            this.baseDistanceTransition = new ColorTransition([6], [2], 1, forthBackTiming);
            
            let startBladeAngle = startBaseAngle;
            let endBladeAngle = endBaseAngle;
            
            this.bladeAngleTransition = new ColorTransition([startBladeAngle], [endBladeAngle], 1);
            
            this.bladeWidthTransition = new ColorTransition([16], [16]);
            
            let gravityDirection = this.user.findState("gravity");
            
            if(typeof gravityDirection == "undefined") {gravityDirection = [0, 0]}
            else {gravityDirection = gravityDirection.direction}
            
            this.hitbox.addInteraction(new DragActor([0, -1.5*gravityDirection[1]]));
        }
        
        return this;
    }
}

class FinalCutter4 extends FinalCutter3 {
    constructor() {
        super();
        this.setId("finalCutter4");
        
        this.slashDuration = 12;
        this.nextAction = FinalCutter5;
        this.setUseCost(0);
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        
        if(face[0] != 0) {
            let startBaseAngle = -Math.PI/2;
            let endBaseAngle = startBaseAngle + face[0] * 2*Math.PI;
            
            this.baseAngleTransition = new ColorTransition([startBaseAngle], [endBaseAngle], 1, Math.sqrt);
            
            this.baseDistanceTransition = new ColorTransition([6], [2], 1, forthBackTiming);
            
            let startBladeAngle = startBaseAngle -face[0] * Math.PI/4;
            let endBladeAngle = startBladeAngle + face[0] * (2*Math.PI + Math.PI/2);
            
            this.bladeAngleTransition = new ColorTransition([startBladeAngle], [endBladeAngle], 1);
            
            this.bladeWidthTransition = new ColorTransition([16], [16]);
        }
        
        return this;
    }
}

class FinalCutter5 extends FinalCutter4 {
    constructor() {
        super();
        this.setId("finalCutter5");
        
        this.slashDuration = 12;
        this.endlag = 16;
        
        this.followup = null;
        this.nextAction = null;
        
        this.hitbox.removeInteractorWithId("typeDamage");
        this.hitbox.addInteraction(new TypeDamager([{"type" : FX_SHARP, "value" : 4}]));
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        
        if(face[0] != 0) {
            let startBaseAngle = -Math.PI/2;
            let endBaseAngle = startBaseAngle + face[0] * 7/8 * 2*Math.PI;
            
            this.baseAngleTransition = new ColorTransition([startBaseAngle], [endBaseAngle], 1);
            
            this.baseDistanceTransition = new ColorTransition([6], [2], 1, forthBackTiming);
            
            let startBladeAngle = startBaseAngle +face[0] * Math.PI/4;
            let endBladeAngle = endBaseAngle;
            
            this.bladeAngleTransition = new ColorTransition([startBladeAngle], [endBladeAngle], 1);
            
            this.bladeWidthTransition = new ColorTransition([16], [16]);
            
            this.hitbox.addInteraction(new DragActor([face[0] * 2, 0]));
        }
        
        return this;
    }
}

class AutoCutter extends CutterAbility {
    constructor() {
        super();
        this.setId("autoCutter");
        
        this.detectionBox = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.detectionBox = Entity.fromMiddle(Vector.addition(this.user.getPositionM(), this.user.getCursorDirection().normalize((this.user.getWidth() + this.user.getHeight()) / 2)), this.user.size);
            
            this.detectionBox.setLifespan(1);
            
            addEntity(this.detectionBox);
        } else if(this.phase == 2) {
            let user = this.user;
            
            if(this.detectionBox.collidedWith.find(function(entity) {return user.opponents.includes(entity);})) {
                this.user.addAction(new FinalCutter1());
            } else {
                this.user.addAction(new CutterBoomerang());
            }
            
            return this;
        }
        
        return this;
    }
    
    allowsReplacement(action) {
        return AS_CUTTER.includes(action.getId()) && !action.matchId("autoCutter");
    }
}

AC["autoCutter"] = AutoCutter;
