
const AS_CUTTER = set_gather("cutterBoomerang", "cutterDash", "finalCutter1", "finalCutter2", "finalCutter3", "autoCutter", "finalCutter4", "finalCutter5");

class CutterAbility extends BusyAction {
    constructor() {
        super();
    }
}

// const cutterdrawable = new PolygonDrawable([[16, 0], [12, 4], [8, 8], [-8, 16], [0, 0], [-8, -16], [8, -8], [12, -4]]);
const cutterdrawable = new PolygonDrawable([[16, 0], [12, 12], [0, 12], [-8, 8], [-16, 12], [-8, 0], [0, 0], [17, -4]]);

// const cutterEdgeStyle = new ColorTransition([255, 223, 0, 1], [255, 223, 0, 0], 16);
const cutterEdgeStyle = new ColorTransition([255, 255, 255, 1], [0, 255, 255, 0], 12, bezierLinear);

const cutterTrailStyle = new MultiColorTransition([[255, 255, 127, 1], [159, 127, 0, 0.5]], 10, powt(4));
const cutterTrailStyle0 = new ColorTransition([255, 255, 0, 1], [127, 127, 63, 0], 8);
const cutterTrailStyle1 = new ColorTransition([255, 255, 255, 1], [127, 127, 255, 0], 8);

function colorTransitionMix(ct1, ct2, t) {
    let duration = Math.max(ct1.duration, ct2.duration);
    let vector1Transition = new ColorTransition(ct1.vector1, ct2.vector1, duration);
    let vector2Transition = new ColorTransition(ct1.vector2, ct2.vector2, duration);
    
    return new ColorTransition(vector1Transition.at(t), vector2Transition.at(t), duration);
}

const cutterCyanTrail = new ColorTransition([127, 255, 255, 1], [0, 0, 255, 0], 8, powt(2));

class Cutter extends TrailerEntity {
    constructor() {
        super(...arguments);
        
        // this.setStyle("cyan");
        this.addInteraction((new TypeDamager()).setRehit(9));
        this.addInteraction(new ContactVanishRecipient(1));
        
        this.addActset(AS_MOVEMENT);
        
        // this.trailDrawable = new TrailDrawable();
        this.trailDrawable.edgeStyle = cutterEdgeStyle;
        this.angle = 0;
        
        this.previousPositionM = null;
        
        this.setLifespan(64);
        
        this.bladeDrawable = PolygonDrawable.from(cutterdrawable).multiplySize(1/2);
        this.bladeDrawable.setPositionM(this.getPositionM());
        // this.bladeDrawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 1], 64));
        // this.bladeDrawable.setStyle(new ColorTransition([255, 191, 63, 1], [255, 191, 63, 0], 64));
        this.bladeDrawable.setStyle((new ColorTransition([255, 255, 0, 1], [0, 255, 255, 1], 4)).setLoop(true));
        
        this.addInteraction(new VacuumDragActor(-0.125));
        
        let lifespan = 12;
        let otherTrail = new TrailDrawable();
        otherTrail.edgeWidth = 2;
        otherTrail.trailStyle = cutterEdgeStyle.copy();
        this.trailDrawable.otherTrails.add(otherTrail);
        otherTrail = new TrailDrawable();
        otherTrail.edgeWidth = -4;
        otherTrail.trailStyle = cutterEdgeStyle.copy();
        this.trailDrawable.otherTrails.add(otherTrail);
        
        for(let i = 0; i < 0; ++i) {
            let otherTrail = new TrailDrawable();
            otherTrail.edgeWidth = irandom(-6, +2);
            otherTrail.trailStyle = cutterEdgeStyle.copy();
            this.trailDrawable.otherTrails.add(otherTrail);
        }
        
        this.setTypeOffense(FX_SHARP, 1);
        this.addInteraction(new StunActor());
        
        this.drawables.add(this.bladeDrawable);
    }
    
    updateDrawable() {
        let positionM = this.getPositionM();
        
        let positionTransition = new ColorTransition(positionM, positionM);
        
        if(this.previousPositionM != null) {positionTransition = new ColorTransition(this.previousPositionM, positionM)}
        
        let rotation = 2*Math.PI/6;
        let det = 6;
        
        for(let i = 0; i < det; ++i) {
            this.angle += rotation/det;
            
            let closePoint = positionTransition.at((i+1)/det);
            
            let farWidth = Math.cos(this.angle) * 2 + 8;
            
            if(i/(det-1) > 2.75) {
                this.trailDrawable.trailStyle = new ColorTransition([255, 255, 255, 1], [0, 255, 255, 0.5], 12).setStep(1-i/det);
            } else {
                this.trailDrawable.trailStyle = cutterTrailStyle.copy().setStep(1-i/det);
                
                // this.trailDrawable.trailStyle = colorTransitionMix(cutterTrailStyle0, cutterTrailStyle1, i/det);
                
                // this.trailDrawable.trailStyle = new ColorTransition([255, 255, 255 * i/det, 1], [127, 127, 63 + (255 - 63) * i/det, 0], 8);
            }
            this.trailDrawable.addSized(closePoint, this.angle, farWidth, farWidth - 1);
        }
        
        this.bladeDrawable.setPositionM(this.getPositionM());
        this.bladeDrawable.rotate(rotation);
        
        this.previousPositionM = positionM;
        
        return super.updateDrawable();
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
        
        this.setUseCost(4);
        
        
        
        this.slashDuration = 16;
        this.endlag = 8;
        this.trailDrawable.edgeStyle = ColorTransition.from(cutterEdgeStyle).setDuration(32);
        
        for(let i = 0; i < 4; ++i) {
            let otherTrail = new TrailDrawable();
            otherTrail.edgeWidth = 2 - i * 2; irandom(-8, +2);
            this.trailDrawable.otherTrails.add(otherTrail);
        }
        
        this.dragInterrecipient = null;
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
                
                this.dragInterrecipient = this.user.findInterrecipientWithId("drag");
                this.user.removeInterrecipientWithId("drag");
                this.user.setSpeed(this.direction.normalized(4));
            } else {
                return this.end();
            }
        }
        if(this.phase < 16) {
            // this.user.drag(this.direction.normalize(thrust * 2));
            // this.user.setSpeed(this.direction.normalize(3));
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
        
        return this;
    }
    
    onend() {
        this.user.addInteraction(this.damageableSave);
        this.user.addInteraction(this.dragInterrecipient);
        
        return super.onend();
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        
        let angle = face.getAngle();
        
        this.baseAngleTransition = new ColorTransition([angle - Math.PI/2], [angle + Math.PI/2]);
        this.baseDistanceTransition = new ColorTransition([6], [6]);
        this.bladeAngleTransition = new ColorTransition([angle - Math.PI], [angle + 3/4*Math.PI]);
        this.bladeWidthTransition = new ColorTransition([16], [16]);
        
        return this;
    }
    
    updateTrailDrawableStyle(detProgress) {
        if(detProgress == 2) {
            this.trailDrawable.trailStyle = new ColorTransition([255, 255, 127, 1], [0, 255, 255, 0], 12);
        } else {
            this.trailDrawable.trailStyle = cutterCyanTrail.copy().setStep(1-detProgress).setDuration(16);
            this.trailDrawable.timing = powt(1/64);
        }
        
        for(let i = 0; i < this.trailDrawable.otherTrails.length; ++i) {
            this.trailDrawable.otherTrails[i].trailStyle = cutterEdgeStyle.copy().setStep(1-detProgress).setDuration(24);
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
    
    return ovalTransition((rt+1)/2);
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
        
        this.slashDuration = 6;
        
        this.baseDistanceTransition = new ColorTransition([6], [2], 1, forthBackTiming);
        
        this.det = 12;
        this.hitbox.setLifespan(this.slashDuration + 1);
        
        this.followup = FinalCutter2;
        
        this.hitbox.addInteraction(new StunActor(64));
        this.endlag = 16;
        
        this.setUseCost(3);
        
        // let otherTrail = new TrailDrawable();
        // otherTrail.edgeWidth = 2;
        // this.trailDrawable.otherTrails.add(otherTrail);
        
        for(let i = 0; i < 4; ++i) {
            let otherTrail = new TrailDrawable();
            otherTrail.edgeWidth = 2 - i * 2; irandom(-8, +2);
            this.trailDrawable.otherTrails.add(otherTrail);
        }
    }
    
    updateTrailDrawableStyle(detProgress) {
        if(this.user.getEnergyRatio() < 0.5) {
            this.trailDrawable.trailStyle = cutterCyanTrail.copy().setStep(1-detProgress);
            this.hitbox.setTypeOffense(FX_GOLD_, 8);
        } else {
            this.trailDrawable.trailStyle = cutterTrailStyle.copy().setStep(1-detProgress);
        }
        
        for(let i = 0; i < this.trailDrawable.otherTrails.length; ++i) {
            // let lifespan = 10;
            
            // let ct = new ColorTransition([255, 255, 255, irandom(75, 100)/100], [0, 255, 255, 0], lifespan, bezierLinear);
            
            // this.trailDrawable.otherTrails[i].trailStyle = new ColorTransition(ct.at((1-detProgress)/ct.duration), ct.at(1), lifespan, bezierLinear);
            
            this.trailDrawable.otherTrails[i].trailStyle = cutterEdgeStyle.copy().setStep(1-detProgress);
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
        } else {
            return null;
        }
        
        return this;
    }
    
    use() {
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

function ovalTransition(t) {
    let angle = t * 2*Math.PI;
    
    let distance = Math.sqrt(Math.pow(1*Math.cos(angle), 2) + Math.pow(1*Math.sin(angle), 2));
    
    // console.log(distance);
    
    return distance;
}

function fc2Timing(t) {
    return -Math.cos(t*4*Math.PI)/2+0.5;
    
    t %= 0.5;
    
    return -Math.pow((t*4-1), 2) + 1;
}

class FinalCutter2 extends FinalCutter1 {
    constructor() {
        super();
        this.setId("finalCutter2");
        
        this.face = null;
        this.type = "";
        
        // this.slashDuration = 10;
        this.hitbox.setLifespan(this.slashDuration + 1);
        
        this.followup = FinalCutter3;
    }
    
    transitionsSetup() {
        this.face = this.user.getCursorDirection();
        
        if(this.face[0] != 0) {
            this.type = "horizontal";
            
            this.face[0] = Math.sign(this.face[0]);
            
            const bladeRad1 = 16;
            const bladeRad2 = 6;
            
            let startBaseAngle = (new Vector(-this.face[0], 0)).getAngle();
            let endBaseAngle = startBaseAngle - this.face[0] * 2 * Math.PI;
            
            this.baseAngleTransition = new ColorTransition([startBaseAngle], [endBaseAngle], 1, makeFullOvalTiming(bladeRad1, bladeRad2));
            
            this.baseDistanceTransition = new ColorTransition([4], [0], 1, makeForthBackCurve(2));
            
            this.startBladeAngle = new Vector(-this.face[0], 0).getAngle();
            this.endBladeAngle = this.startBladeAngle - this.face[0] * 2 * Math.PI;
            
            this.bladeAngleTransition = new ColorTransition([this.startBladeAngle], [this.endBladeAngle], 1, makeFullOvalTiming(bladeRad1, bladeRad2));
            
            this.bladeWidthTransition = new ColorTransition([0], [1], 1, function(t) {
                let angle = t * 2*Math.PI;
                
                let cos = bladeRad1 * Math.cos(angle);
                let sin = bladeRad2 * Math.sin(angle);
                
                return (new Vector(cos, sin)).getNorm();
            });
        } else {
            return null;
        }
        
        return this;
    }
}

class FinalCutter3 extends FinalCutter2 {
    constructor() {
        super();
        this.setId("finalCutter3");
        
        this.slashDuration = 8;
        
        this.hitbox.setLifespan(this.slashDuration + 1);
        
        this.followup = null;
        this.nextAction = null;
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
            
            let gravityDirection = this.user.getGravityDirection();
            
            this.hitbox.launchDirection = gravityDirection.normalized(-10);
        } else {
            return null;
        }
        
        return this;
    }
    
    use() {
        super.use();
        
        if(this.phase > 0) {
            this.nextAction = FinalCutter4;
        }
        
        if(this.phase === 2) {
            let gravityDirection = this.user.getGravityDirection();
            
            this.user.speed.set(1, Vector.from(gravityDirection).normalized(-6)[1]);
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
        this.endlag = 0;
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
        } else {
            return null;
        }
        
        return this;
    }
    
    use() {
        return this.slashUpdate();
    }
}

class CutterWave extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.setDrawable(null);
        
        this.addInteraction(new TypeDamager());
        this.setLifespan(24);
        
        for(let i = 0; i < 2; ++i) {
            let drawable = PolygonDrawable.from(makeSpikePolygon(7, new VectorTransition([-Math.PI/4], [+Math.PI/4]), function() {return irandom(8, 10)}, function() {return irandom(12, 20)}, 6));
            drawable.multiplySize(2);
            drawable.rotate(Math.PI);
            drawable.setStyle(new ColorTransition([255, 255, 0, 1], [255, 127, 0, 0], 16, powt(6)));
            
            this.drawables.add(drawable);
        }
        
        for(let i = 0; i < 2; ++i) {
            let drawable = PolygonDrawable.from(makeSpikePolygon(7, new VectorTransition([-Math.PI/4], [+Math.PI/4]), function() {return irandom(8, 10)}, function() {return irandom(12, 20)}, 6));
            drawable.multiplySize(1.5);
            drawable.rotate(Math.PI);
            drawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 127, 255, 0], 16, powt(6)));
            
            this.drawables.add(drawable);
        }
        
        this.setTypeOffense(FX_SHARP, 1);
    }
    
    updateDrawable() {
        for(let i = 0; i < this.drawables.length; ++i) {
            this.drawables[i].setPositionM(this.getPositionM());
            this.drawables[i].setImaginaryAngle(this.speed.getAngle());
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
        
        this.hitbox.setTypeOffense(FX_SHARP, 4);
        
        this.face0 = 0;
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
            
            this.bladeAngleTransition = new ColorTransition([startBladeAngle], [endBladeAngle], 1, powt(1.625));
            
            this.bladeWidthTransition = new ColorTransition([16], [16]);
            
            let gravityDirection = this.user.getGravityDirection();
            
            this.hitbox.addInteraction(new DragActor(gravityDirection.normalized(6)));
            
            this.user.speed.add(gravityDirection.normalized(6));
        } else {
            return null;
        }
        
        this.face0 = face[0];
        
        return this;
    }
    
    use() {
        super.use();
        
        if(this.phase == 4) {
            if(this.sbat === undefined) {
                this.sbat = this.bladeAngleTransition;
            }
            
            if(this.user.findState("grounded") === undefined && !this.user.getGravityDirection().isZero()) {
                this.bladeAngleTransition = new VectorTransition([Math.acos(this.face0)], [Math.acos(this.face0)]);
                this.phase = 3;
                // repaceLoop(1000);
            } else {
                this.bladeAngleTransition = this.sbat;
                // repaceLoop(16);
                let direction = new Vector(this.face0, 0);
                
                let hitbox = CutterWave.fromMiddle(direction.normalize(rectangle_averageSize(this.user)/4).plus(this.user.getPositionM()), [16, 16]);
                hitbox.shareBlacklist(this.user.getBlacklist());
                
                hitbox.setSpeed(direction.normalize(6));
                hitbox.launchDirection = direction.normalized(6);
                
                addEntity(hitbox);
            }
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
            
            // if(this.detectionBox.collidedWith.find(function(entity) {return user.opponents.includes(entity);})) {
            if(this.detectionBox.collidedWith.find(function(entity) {return entity !== user && entity.findInterrecipientWithId("damage");}) && this.user.getCursorDirection()[0] != 0) {
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

AC["cutterDash"] = CutterDash;

function makeOvalPath(pointsCount, radius1, radius2) {
    let points = [];
    
    for(let i = 0; i < pointsCount; ++i) {
        let angle = i/(pointsCount-1) * 2*Math.PI;
        
        points.push([radius1 * Math.cos(angle), radius2 * Math.sin(angle)]);
    }
    
    return points;
}
